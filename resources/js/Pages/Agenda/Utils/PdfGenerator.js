import { jsPDF } from "jspdf";

export class AgendaPdfGenerator {
    constructor() {
        this.pdf = new jsPDF('landscape');
        this.pageHeight = this.pdf.internal.pageSize.height;
        this.pageWidth = this.pdf.internal.pageSize.width;
        this.margin = 12; // Reduced margin for more space
        this.currentY = this.margin;
        
        // Refined professional color scheme - mostly white with blue accents
        this.colors = {
            primary: [31, 81, 153],       // Professional blue
            header_bg: [31, 81, 153],     // Header background
            light_blue: [240, 248, 255],  // Very light blue background
            white: [255, 255, 255],       // White
            text_dark: [33, 37, 41],      // Dark text
            text_medium: [73, 80, 87],    // Medium text
            border_light: [220, 235, 255], // Light blue border
            accent_bg: [248, 252, 255]    // Subtle blue accent
        };
    }

    checkPageBreak(height) {
        if (typeof height !== 'number') {
            height = 10;
        }
        if (this.currentY + height > this.pageHeight - this.margin - 20) { // Reduced footer space
            this.pdf.addPage();
            this.currentY = this.margin;
            this.addTableHeader();
        }
    }

    addHeader(title, subtitle) {
        this.pdf.setFontSize(16); // Reduced font size
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text(title, this.margin, this.currentY);
        this.currentY += 10; // Reduced spacing

        if (subtitle) {
            this.pdf.setFontSize(10); // Reduced font size
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            this.pdf.text(subtitle, this.margin, this.currentY);
            this.currentY += 6; // Reduced spacing
        }

        // Minimal divider line
        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(31, 81, 153);
        this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
        this.currentY += 8; // Reduced spacing
    }

    addExportInfo(exportDate, totalItems, filters) {
        this.checkPageBreak(25); // Reduced height
        
        // Minimal information panel with light blue background
        this.pdf.setFillColor(248, 252, 255);
        this.pdf.rect(this.margin, this.currentY - 3, this.pageWidth - (this.margin * 2), 22, 'F');
        
        // Light border
        this.pdf.setLineWidth(0.2);
        this.pdf.setDrawColor(220, 235, 255);
        this.pdf.rect(this.margin, this.currentY - 3, this.pageWidth - (this.margin * 2), 22);
        
        this.pdf.setFontSize(10); // Reduced font size
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Export Summary", this.margin + 5, this.currentY + 4);
        
        this.pdf.setFontSize(8); // Reduced font size
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        
        let infoY = this.currentY + 10;
        
        // Compact single-line format
        let infoText = `Generated: ${exportDate} | Items: ${totalItems}`;
        
        if (filters && filters.search) {
            infoText += ` | Search: "${filters.search}"`;
        }
        
        if (filters && filters.filter_id) {
            infoText += ` | ID: ${filters.filter_id}`;
        }
        
        const sortBy = (filters && filters.sort_by) ? filters.sort_by : 'date';
        const sortOrder = (filters && filters.sort_order) ? filters.sort_order : 'asc';
        infoText += ` | Sort: ${sortBy} (${sortOrder})`;
        
        this.pdf.text(infoText, this.margin + 5, infoY);
        
        this.currentY += 20; // Reduced spacing
    }

    // FIXED: Get unique rooms only from the provided agendas (session-specific)
    getUniqueRooms(agendas) {
        const rooms = new Set();
        
        if (agendas && agendas.length > 0) {
            agendas.forEach(agenda => {
                if (agenda.location && agenda.location.trim() && agenda.location.trim() !== 'TBA') {
                    rooms.add(agenda.location.trim());
                }
            });
        }
        
        const roomArray = Array.from(rooms).sort();

        // If no valid rooms found in this specific session, return a single "Event Details" column
        if (roomArray.length === 0) {
            return ['Event Details'];
        }

        return roomArray.slice(0, 5); // Max 5 rooms for better layout
    }

    groupAgendasByConferenceDays(agendas) {
        const conferenceDays = {};
        
        if (!agendas || agendas.length === 0) {
            return conferenceDays;
        }
        
        agendas.forEach(agenda => {
            // Skip invalid agenda items
            if (!agenda || !agenda.conference || !agenda.date || !agenda.title) {
                return;
            }
            
            if (agenda.conference && agenda.date) {
                const conferenceId = agenda.conference.id;
                const conferenceKey = `${conferenceId}-${agenda.conference.conf_name}`;
                
                if (!conferenceDays[conferenceKey]) {
                    conferenceDays[conferenceKey] = {
                        conference: agenda.conference,
                        days: {}
                    };
                }
                
                const dayNumber = this.calculateConferenceDay(agenda.conference, agenda.date);
                const dayKey = `Day ${dayNumber}`;
                
                if (!conferenceDays[conferenceKey].days[dayKey]) {
                    conferenceDays[conferenceKey].days[dayKey] = {
                        date: agenda.date,
                        sessions: {}
                    };
                }
                
                const sessionName = this.getSessionFromTime(agenda.start_time) || agenda.session || 'General';
                
                if (!conferenceDays[conferenceKey].days[dayKey].sessions[sessionName]) {
                    conferenceDays[conferenceKey].days[dayKey].sessions[sessionName] = [];
                }
                
                conferenceDays[conferenceKey].days[dayKey].sessions[sessionName].push(agenda);
            }
        });
        
        return conferenceDays;
    }

    getSessionFromTime(startTime) {
        if (!startTime) return 'General';
        
        const hour = parseInt(startTime.split(':')[0]);
        
        if (hour >= 6 && hour < 12) {
            return 'Morning Session';
        } else if (hour >= 12 && hour < 17) {
            return 'Afternoon Session';
        } else if (hour >= 17 && hour < 22) {
            return 'Evening Session';
        } else {
            return 'Night Session';
        }
    }

    calculateConferenceDay(conference, targetDate) {
        if (!conference || !conference.start_date || !targetDate) {
            return 1;
        }
        
        const startDate = new Date(conference.start_date);
        const agendaDate = new Date(targetDate);
        
        const timeDiff = agendaDate.getTime() - startDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        return dayDiff + 1;
    }

    // FIXED: addTableHeader now properly handles session-specific rooms
    addTableHeader(agendas = []) {
        const tableWidth = this.pageWidth - (this.margin * 2);
        const uniqueRooms = this.getUniqueRooms(agendas);
        const numberOfRooms = uniqueRooms.length;
        
        const colWidths = {
            time: 40, // Reduced width
            room: (tableWidth - 40) / numberOfRooms
        };

        // Clean header with minimal blue background
        this.pdf.setFillColor(31, 81, 153);
        this.pdf.rect(this.margin, this.currentY, tableWidth, 15, 'F'); // Reduced height
        
        let currentX = this.margin;
        
        // Time column header - more compact
        this.pdf.setFontSize(8); 
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.text("TIME", currentX + 2, this.currentY + 5);
        this.pdf.setFontSize(6);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.text("Schedule", currentX + 2, this.currentY + 10);
        currentX += colWidths.time;
        
        // Room headers - compact design
        for (let i = 0; i < uniqueRooms.length; i++) {
            const room = uniqueRooms[i];
            
            // Clean separator line
            this.pdf.setLineWidth(0.3);
            this.pdf.setDrawColor(255, 255, 255);
            this.pdf.line(currentX, this.currentY, currentX, this.currentY + 15);
            
            let roomDisplayName = room;
            let roomSubtext = "Room";
            
            // Special handling for "Event Details" column
            if (room === 'Event Details') {
                roomDisplayName = "EVENT";
                roomSubtext = "Details";
            } else if (room.length > 12) {
                roomDisplayName = room.substring(0, 9) + "...";
            }
            
            this.pdf.setFontSize(7); // Reduced font size
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(255, 255, 255);
            this.pdf.text(roomDisplayName.toUpperCase(), currentX + 2, this.currentY + 5);
            
            this.pdf.setFontSize(5);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.text(roomSubtext, currentX + 2, this.currentY + 10);
            
            currentX += colWidths.room;
        }
        
        this.currentY += 15; // Reduced spacing
        this.currentRooms = uniqueRooms;
    }

    addAgendaTableRows(agendas) {
        if (!agendas || agendas.length === 0) {
            this.addNoDataRow();
            return;
        }
        
        // Skip if no valid rooms (this shouldn't happen if we filter properly above)
        if (!this.currentRooms || this.currentRooms.length === 0) {
            return;
        }

        const timeSlots = this.groupAgendasByTimeAndRoom(agendas);
        const tableWidth = this.pageWidth - (this.margin * 2);
        const numberOfRooms = this.currentRooms.length;
        const colWidths = {
            time: 40,
            room: (tableWidth - 40) / numberOfRooms
        };

        let rowIndex = 0;
        const sortedTimeSlots = Object.keys(timeSlots).sort();
        
        for (let t = 0; t < sortedTimeSlots.length; t++) {
            const timeSlot = sortedTimeSlots[t];
            this.checkPageBreak(30); // Reduced check height
            
            const isEvenRow = rowIndex % 2 === 0;
            const rowHeight = this.calculateRowHeight(timeSlots[timeSlot], colWidths.room);
            
            // Subtle alternating row background
            if (isEvenRow) {
                this.pdf.setFillColor(250, 253, 255); // Very light blue
                this.pdf.rect(this.margin, this.currentY, tableWidth, rowHeight, 'F');
            }
            
            let currentX = this.margin;
            
            // Time column with minimal border
            this.pdf.setLineWidth(0.2);
            this.pdf.setDrawColor(220, 235, 255);
            this.pdf.rect(currentX, this.currentY, colWidths.time, rowHeight);
            
            this.pdf.setFontSize(7); // Reduced font size
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(33, 37, 41);
            
            const timeText = timeSlot === 'break' ? 'BREAK' : this.formatTimeSlot(timeSlot);
            const timeLines = timeText.split('\n');
            let timeY = this.currentY + 6;
            
            for (let i = 0; i < timeLines.length; i++) {
                this.pdf.text(timeLines[i], currentX + 1, timeY);
                timeY += 5; // Reduced line spacing
            }
            
            currentX += colWidths.time;
            
            // Content columns for each room
            for (let i = 0; i < this.currentRooms.length; i++) {
                const room = this.currentRooms[i];
                this.pdf.rect(currentX, this.currentY, colWidths.room, rowHeight);
                
                // Normal room matching - exact match
                const agendaForRoom = timeSlots[timeSlot].find(agenda => 
                    agenda && agenda.location && agenda.location.trim() === room
                );
                
                if (agendaForRoom) {
                    this.addCellContent(agendaForRoom, currentX, this.currentY, colWidths.room, rowHeight);
                }
                
                currentX += colWidths.room;
            }
            
            this.currentY += rowHeight;
            rowIndex++;
        }
    }

    addCellContent(agenda, x, y, width, height) {
        const padding = 2; // Reduced padding
        let textY = y + padding + 5;
        
        // Event type - compact
        this.pdf.setFontSize(5); // Very small
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        
        const eventType = this.capitalize(agenda.type || 'Session');
        this.pdf.text(eventType.toUpperCase(), x + padding, textY);
        textY += 4;
        
        // Title - compact
        this.pdf.setFontSize(6); // Reduced
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(33, 37, 41);
        
        const titleLines = this.pdf.splitTextToSize(agenda.title, width - padding * 2);
        const maxLines = Math.min(titleLines.length, 2);
        for (let i = 0; i < maxLines; i++) {
            this.pdf.text(titleLines[i], x + padding, textY);
            textY += 4;
        }
        
        if (titleLines.length > 2) {
            this.pdf.text("...", x + padding, textY);
            textY += 4;
        }
        
        // Speaker - compact
        if (agenda.speaker && textY < y + height - 4) {
            this.pdf.setFontSize(5);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            
            const speakerText = agenda.speaker;
            const speakerLines = this.pdf.splitTextToSize(speakerText, width - padding * 2);
            this.pdf.text(speakerLines[0], x + padding, textY);
        }
    }

    groupAgendasByTimeAndRoom(agendas) {
        const timeSlots = {};
        
        for (let i = 0; i < agendas.length; i++) {
            const agenda = agendas[i];
            let timeKey;
            
            if (agenda.start_time && agenda.end_time) {
                timeKey = agenda.start_time + "-" + agenda.end_time;
            } else if (agenda.start_time) {
                timeKey = agenda.start_time;
            } else {
                timeKey = "TBA";
            }
            
            if (!timeSlots[timeKey]) {
                timeSlots[timeKey] = [];
            }
            
            timeSlots[timeKey].push(agenda);
        }
        
        return timeSlots;
    }

    calculateRowHeight(agendas, colWidth) {
        let maxHeight = 20; // Reduced minimum height
        
        for (let i = 0; i < agendas.length; i++) {
            const agenda = agendas[i];
            if (agenda) {
                const titleLines = this.pdf.splitTextToSize(agenda.title, colWidth - 4);
                const estimatedHeight = 12 + (Math.min(titleLines.length, 2) * 4) + (agenda.speaker ? 5 : 0);
                maxHeight = Math.max(maxHeight, estimatedHeight);
            }
        }
        
        return Math.min(maxHeight, 35); // Reduced cap
    }

    formatTimeSlot(timeSlot) {
        if (timeSlot === "TBA") return "TBA";
        
        const parts = timeSlot.split("-");
        if (parts.length === 2) {
            return this.formatTime(parts[0]) + "\n" + this.formatTime(parts[1]);
        }
        return this.formatTime(timeSlot);
    }

    addNoDataRow() {
        const tableWidth = this.pageWidth - (this.margin * 2);
        const rowHeight = 30; // Reduced height
        
        this.pdf.setFillColor(252, 254, 255);
        this.pdf.rect(this.margin, this.currentY, tableWidth, rowHeight, 'F');
        
        this.pdf.setLineWidth(0.2);
        this.pdf.setDrawColor(220, 235, 255);
        this.pdf.rect(this.margin, this.currentY, tableWidth, rowHeight);
        
        this.pdf.setFontSize(10); // Reduced
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text("NO AGENDA ITEMS FOUND", this.pageWidth / 2, this.currentY + 12, { align: 'center' });
        
        this.pdf.setFontSize(8);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.text("No items match the current filters.", this.pageWidth / 2, this.currentY + 20, { align: 'center' });
        
        this.currentY += rowHeight + 5;
    }

    addFooter() {
        const totalPages = this.pdf.internal.getNumberOfPages();
        const currentPage = this.pdf.internal.getCurrentPageInfo().pageNumber;
        
        // Minimal footer line
        this.pdf.setLineWidth(0.2);
        this.pdf.setDrawColor(220, 235, 255);
        this.pdf.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);
        
        // Compact footer text
        this.pdf.setFontSize(7); // Reduced
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        
        const footerLeft = "Conference System";
        const footerCenter = new Date().toLocaleDateString('en-US');
        const footerRight = `Page ${currentPage} of ${totalPages}`;
        
        this.pdf.text(footerLeft, this.margin, this.pageHeight - 8);
        this.pdf.text(footerCenter, this.pageWidth / 2, this.pageHeight - 8, { align: 'center' });
        this.pdf.text(footerRight, this.pageWidth - this.margin, this.pageHeight - 8, { align: 'right' });
    }

    formatTime(timeString) {
        if (!timeString) return 'TBA';
        const parts = timeString.split(':');
        if (parts.length >= 2) {
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            const date = new Date();
            date.setHours(hours, minutes);
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        }
        return timeString;
    }

    formatDate(dateString) {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', // Shortened
            year: 'numeric', 
            month: 'short', // Shortened
            day: 'numeric' 
        });
    }

    capitalize(str) {
        if (!str) return 'Session';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    generateAllAgendasPDF(agendas, filters) {
        if (!filters) filters = {};
        const exportDate = new Date().toLocaleDateString('en-US');
        
        const conferenceDays = this.groupAgendasByConferenceDays(agendas);
        
        // Compact cover page
        this.addCompactCoverPage(agendas, conferenceDays, exportDate);
        
        const conferenceKeys = Object.keys(conferenceDays);
        
        if (conferenceKeys.length === 0) {
            this.pdf.addPage();
            this.currentY = this.margin;
            this.addHeader('CONFERENCE AGENDA', exportDate);
            this.addExportInfo(exportDate, agendas ? agendas.length : 0, filters);
            this.addTableHeader(agendas);
            this.addAgendaTableRows(agendas);
        } else {
            for (let i = 0; i < conferenceKeys.length; i++) {
                const conferenceKey = conferenceKeys[i];
                const conferenceData = conferenceDays[conferenceKey];
                
                this.pdf.addPage();
                this.currentY = this.margin;
                
                // Preserve conference information
                this.addCompactConferenceHeader(conferenceData.conference);
                
                const dayKeys = Object.keys(conferenceData.days).sort();
                
                for (let j = 0; j < dayKeys.length; j++) {
                    const dayKey = dayKeys[j];
                    const dayData = conferenceData.days[dayKey];
                    
                    // Preserve day separation
                    this.addCompactDayHeader(dayKey, dayData.date);
                    
                    const sessionKeys = Object.keys(dayData.sessions).sort((a, b) => {
                        const sessionOrder = {
                            'Morning Session': 1,
                            'Afternoon Session': 2,
                            'Evening Session': 3,
                            'Night Session': 4,
                            'General': 5
                        };
                        return (sessionOrder[a] || 999) - (sessionOrder[b] || 999);
                    });
                    
                    for (let k = 0; k < sessionKeys.length; k++) {
                        const sessionKey = sessionKeys[k];
                        const sessionAgendas = dayData.sessions[sessionKey];
                        
                        // Preserve session information
                        this.addCompactSessionHeader(sessionKey);
                        // FIXED: Pass sessionAgendas to get session-specific rooms only
                        this.addTableHeader(sessionAgendas);
                        this.addAgendaTableRows(sessionAgendas);
                        
                        if (k < sessionKeys.length - 1) {
                            this.currentY += 6; // Reduced spacing
                        }
                    }
                    
                    if (j < dayKeys.length - 1) {
                        this.currentY += 10; // Reduced spacing
                        this.checkPageBreak(40);
                    }
                }
            }
        }
        
        this.addFootersToAllPages();
        
        const filename = 'conference-agenda-' + new Date().toISOString().split('T')[0] + '.pdf';
        this.pdf.save(filename);
    }

    generateSingleAgendaPDF(agenda) {
        this.addCompactSingleAgendaCoverPage(agenda);
        
        if (agenda && agenda.description && agenda.description.trim()) {
            this.pdf.addPage();
            this.currentY = this.margin;
            this.addCompactDescriptionPage(agenda);
        }
        
        this.addFootersToAllPages();
        
        const cleanTitle = agenda && agenda.title ? agenda.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : 'unknown';
        const agendaId = agenda && agenda.id ? agenda.id : 'unknown';
        const dayNumber = agenda && agenda.conference ? this.calculateConferenceDay(agenda.conference, agenda.date) : '';
        const dayPrefix = dayNumber ? `day${dayNumber}-` : '';
        const filename = `agenda-${dayPrefix}${agendaId}-${cleanTitle}.pdf`;
        this.pdf.save(filename);
    }

    addFootersToAllPages() {
        const totalPages = this.pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            this.pdf.setPage(i);
            this.addFooter();
        }
    }

    // Compact conference header preserving all information
    addCompactConferenceHeader(conference) {
        this.checkPageBreak(20);
        
        // Minimal header with light blue background
        this.pdf.setFillColor(248, 252, 255);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 18, 'F');
        
        this.pdf.setLineWidth(0.3);
        this.pdf.setDrawColor(220, 235, 255);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 18);
        
        // Conference name
        this.pdf.setFontSize(11);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text(conference.conf_name || 'Conference', this.margin + 5, this.currentY + 7);
        
        // Conference dates on same line
        this.pdf.setFontSize(8);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        
        const startDate = conference.start_date ? this.formatDate(conference.start_date) : 'TBA';
        const endDate = conference.end_date ? this.formatDate(conference.end_date) : 'TBA';
        const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
        
        this.pdf.text(dateRange, this.margin + 5, this.currentY + 14);
        
        if (conference.location) {
            this.pdf.text(`Venue: ${conference.location}`, this.margin + 150, this.currentY + 14);
        }
        
        this.currentY += 22;
    }

    // Compact day header preserving day information
    addCompactDayHeader(dayTitle, date) {
        this.checkPageBreak(15);
        
        this.pdf.setFillColor(31, 81, 153);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 12, 'F');
        
        this.pdf.setFontSize(9);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.text(dayTitle.toUpperCase(), this.margin + 5, this.currentY + 5);
        
        this.pdf.setFontSize(7);
        this.pdf.setFont("helvetica", "normal");
        const formattedDate = this.formatDate(date);
        this.pdf.text(formattedDate, this.margin + 5, this.currentY + 9);
        
        this.currentY += 15;
    }

    // Compact session header preserving session information
    addCompactSessionHeader(sessionTitle) {
        this.checkPageBreak(12);
        
        this.pdf.setFillColor(250, 253, 255);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 10, 'F');
        
        this.pdf.setLineWidth(0.2);
        this.pdf.setDrawColor(220, 235, 255);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 10);
        
        this.pdf.setFontSize(8);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text(sessionTitle.toUpperCase(), this.margin + 4, this.currentY + 7);
        
        this.currentY += 12;
    }

    // Compact cover page
    addCompactCoverPage(agendas, conferenceDays, exportDate) {
        this.pdf.setFillColor(255, 255, 255); // Pure white background
        this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
        
        // Title
        this.pdf.setFontSize(20);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("CONFERENCE AGENDA", this.pageWidth / 2, 50, { align: 'center' });
        
        // Subtitle
        this.pdf.setFontSize(12);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text("Official Schedule & Program Guide", this.pageWidth / 2, 65, { align: 'center' });
        
        // Date
        this.pdf.setFontSize(10);
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Generated: " + exportDate, this.pageWidth / 2, 80, { align: 'center' });
        
        // Basic info
        if (agendas && agendas.length > 0) {
            this.currentY = 100;
            
            const totalEvents = agendas.length;
            const uniqueRooms = new Set();
            agendas.forEach(agenda => {
                if (agenda.location) uniqueRooms.add(agenda.location);
            });
            
            this.pdf.setFontSize(10);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            
            this.pdf.text(`${totalEvents} events across ${uniqueRooms.size} rooms`, this.pageWidth / 2, this.currentY, { align: 'center' });
        }
        
        // Minimal footer
        this.pdf.setLineWidth(0.2);
        this.pdf.setDrawColor(220, 235, 255);
        this.pdf.line(this.margin, this.pageHeight - 20, this.pageWidth - this.margin, this.pageHeight - 20);
        
        this.pdf.setFontSize(8);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text("Conference Management System", this.pageWidth / 2, this.pageHeight - 12, { align: 'center' });
    }

    // Compact single agenda cover page preserving all information
    addCompactSingleAgendaCoverPage(agenda) {
        this.pdf.setFillColor(255, 255, 255);
        this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
        
        this.pdf.setFontSize(18);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("AGENDA ITEM", this.pageWidth / 2, 35, { align: 'center' });
        
        if (!agenda) {
            this.pdf.setFontSize(10);
            this.pdf.text("No agenda data available", this.pageWidth / 2, 50, { align: 'center' });
            return;
        }
        
        // Event title
        this.pdf.setFontSize(14);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(33, 37, 41);
        
        const titleLines = this.pdf.splitTextToSize(agenda.title || 'Untitled Event', this.pageWidth - 40);
        let titleY = 55;
        titleLines.slice(0, 2).forEach(line => {
            this.pdf.text(line, this.pageWidth / 2, titleY, { align: 'center' });
            titleY += 10;
        });
        
        // Compact details card
        const cardY = titleY + 15;
        const cardHeight = 80;
        
        this.pdf.setFillColor(248, 252, 255);
        this.pdf.rect(this.margin, cardY, this.pageWidth - (this.margin * 2), cardHeight, 'F');
        
        this.pdf.setLineWidth(0.3);
        this.pdf.setDrawColor(220, 235, 255);
        this.pdf.rect(this.margin, cardY, this.pageWidth - (this.margin * 2), cardHeight);
        
        let contentY = cardY + 10;
        
        // Conference info (preserved)
        if (agenda.conference) {
            this.pdf.setFontSize(12);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(31, 81, 153);
            this.pdf.text(agenda.conference.conf_name, this.margin + 8, contentY);
            
            const dayNumber = this.calculateConferenceDay(agenda.conference, agenda.date);
            this.pdf.setFontSize(9);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.text(`Day ${dayNumber}`, this.pageWidth - this.margin - 8, contentY, { align: 'right' });
            contentY += 15;
        }
        
        // Compact two-column layout
        const leftCol = this.margin + 8;
        const rightCol = this.pageWidth / 2 + 5;
        
        const details = [
            { label: 'Date:', value: this.formatDate(agenda.date), side: 'left' },
            { label: 'Time:', value: `${this.formatTime(agenda.start_time)} - ${this.formatTime(agenda.end_time)}`, side: 'right' },
            { label: 'Room:', value: agenda.location || 'TBA', side: 'left' },
            { label: 'Type:', value: this.capitalize(agenda.type || 'Session'), side: 'right' },
            { label: 'Speaker:', value: agenda.speaker || 'TBA', side: 'left' },
            { label: 'ID:', value: '#' + (agenda.id || 'Unknown'), side: 'right' }
        ];
        
        let leftY = contentY;
        let rightY = contentY;
        
        details.forEach(detail => {
            const xPos = detail.side === 'left' ? leftCol : rightCol;
            const currentY = detail.side === 'left' ? leftY : rightY;
            
            this.pdf.setFontSize(9);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(33, 37, 41);
            this.pdf.text(detail.label, xPos, currentY);
            
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            this.pdf.text(detail.value, xPos + 25, currentY);
            
            if (detail.side === 'left') {
                leftY += 10;
            } else {
                rightY += 10;
            }
        });
        
        // Description note
        if (agenda.description && agenda.description.trim()) {
            const noteY = Math.max(leftY, rightY) + 5;
            this.pdf.setFontSize(8);
            this.pdf.setFont("helvetica", "italic");
            this.pdf.setTextColor(73, 80, 87);
            this.pdf.text('Full description on page 2', this.pageWidth / 2, noteY, { align: 'center' });
        }
        
        // Generation info
        const infoY = cardY + cardHeight + 15;
        this.pdf.setFontSize(8);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, this.pageWidth / 2, infoY, { align: 'center' });
        
        // Footer
        this.pdf.setLineWidth(0.2);
        this.pdf.setDrawColor(220, 235, 255);
        this.pdf.line(this.margin, this.pageHeight - 20, this.pageWidth - this.margin, this.pageHeight - 20);
        
        this.pdf.setFontSize(7);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text("Conference Management System", this.pageWidth / 2, this.pageHeight - 12, { align: 'center' });
    }

    // Compact description page
    addCompactDescriptionPage(agenda) {
        this.pdf.setFontSize(16);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Event Description", this.pageWidth / 2, this.currentY + 8, { align: 'center' });
        this.currentY += 20;
        
        this.pdf.setFontSize(12);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(33, 37, 41);
        this.pdf.text(agenda.title || 'Untitled Event', this.pageWidth / 2, this.currentY, { align: 'center' });
        this.currentY += 20;
        
        if (agenda.description && agenda.description.trim()) {
            const boxHeight = this.pageHeight - this.currentY - 40;
            
            this.pdf.setFillColor(250, 253, 255);
            this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), boxHeight, 'F');
            
            this.pdf.setLineWidth(0.3);
            this.pdf.setDrawColor(220, 235, 255);
            this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), boxHeight);
            
            this.pdf.setFontSize(10);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(33, 37, 41);
            
            const maxWidth = this.pageWidth - (this.margin * 2) - 16;
            const descLines = this.pdf.splitTextToSize(agenda.description, maxWidth);
            
            let descY = this.currentY + 12;
            descLines.forEach(line => {
                if (descY < this.currentY + boxHeight - 12) {
                    this.pdf.text(line, this.margin + 8, descY);
                    descY += 10;
                }
            });
        } else {
            this.pdf.setFontSize(10);
            this.pdf.setFont("helvetica", "italic");
            this.pdf.setTextColor(73, 80, 87);
            this.pdf.text("No description available for this event.", this.pageWidth / 2, this.currentY + 40, { align: 'center' });
        }
    }
}