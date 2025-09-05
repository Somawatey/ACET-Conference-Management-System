import { jsPDF } from "jspdf";

export class AgendaPdfGenerator {
    constructor() {
        this.pdf = new jsPDF('landscape');
        this.pageHeight = this.pdf.internal.pageSize.height;
        this.pageWidth = this.pdf.internal.pageSize.width;
        this.margin = 15;
        this.currentY = this.margin;
        
        // Professional color scheme
        this.colors = {
            primary: [31, 81, 153],       // Professional blue
            header_bg: [31, 81, 153],     // Header background
            light_gray: [245, 245, 245],  // Light background
            white: [255, 255, 255],       // White
            text_dark: [33, 37, 41],      // Dark text
            text_medium: [73, 80, 87],    // Medium text
            border: [206, 212, 218]       // Light border
        };
    }

    checkPageBreak(height) {
        if (typeof height !== 'number') {
            height = 10;
        }
        if (this.currentY + height > this.pageHeight - this.margin - 30) {
            this.pdf.addPage();
            this.currentY = this.margin;
            this.addTableHeader();
        }
    }

    addHeader(title, subtitle) {
        this.pdf.setFontSize(18);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text(title, this.margin, this.currentY);
        this.currentY += 12;

        if (subtitle) {
            this.pdf.setFontSize(11);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            this.pdf.text(subtitle, this.margin, this.currentY);
            this.currentY += 8;
        }

        // Professional divider line
        this.pdf.setLineWidth(0.8);
        this.pdf.setDrawColor(31, 81, 153);
        this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
        this.currentY += 10;
    }

    addExportInfo(exportDate, totalItems, filters) {
        this.checkPageBreak(35);
        
        // Information panel background
        this.pdf.setFillColor(245, 245, 245);
        this.pdf.rect(this.margin, this.currentY - 5, this.pageWidth - (this.margin * 2), 32, 'F');
        
        // Border for information panel
        this.pdf.setLineWidth(0.3);
        this.pdf.setDrawColor(206, 212, 218);
        this.pdf.rect(this.margin, this.currentY - 5, this.pageWidth - (this.margin * 2), 32);
        
        this.pdf.setFontSize(12);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Export Information", this.margin + 8, this.currentY + 5);
        
        this.pdf.setFontSize(9);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        
        let infoY = this.currentY + 14;
        this.pdf.text("Generated: " + exportDate, this.margin + 8, infoY);
        this.pdf.text("Total Items: " + totalItems + " agenda items", this.margin + 8, infoY + 6);
        
        if (filters && filters.search) {
            this.pdf.text("Search Filter: \"" + filters.search + "\"", this.margin + 8, infoY + 12);
        }
        
        if (filters && filters.filter_id) {
            this.pdf.text("ID Filter: " + filters.filter_id, this.margin + 140, infoY + 6);
        }
        
        const sortBy = (filters && filters.sort_by) ? filters.sort_by : 'date';
        const sortOrder = (filters && filters.sort_order) ? filters.sort_order : 'asc';
        this.pdf.text("Sort: " + sortBy + " (" + sortOrder + ")", this.margin + 140, infoY);
        
        this.currentY += 30;
    }

    // ✅ Updated to dynamically get unique rooms from agendas
    getUniqueRooms(agendas) {
        const rooms = new Set();
        
        if (agendas && agendas.length > 0) {
            agendas.forEach(agenda => {
                if (agenda.location && agenda.location.trim()) {
                    rooms.add(agenda.location.trim());
                }
            });
        }
        
        // Convert to array and sort
        const roomArray = Array.from(rooms).sort();
        
        // ✅ FIX: Only return default rooms if we have no agendas at all
        if (roomArray.length === 0 && (!agendas || agendas.length === 0)) {
            return ['Room A', 'Room B', 'Room C', 'Room D'];
        }
        
        // ✅ FIX: If we have agendas but no rooms, return 'TBA'
        if (roomArray.length === 0) {
            return ['TBA'];
        }
        
        return roomArray.slice(0, 6); // Max 6 rooms for layout purposes
    }

    // ✅ NEW: Group agendas by conference days and sessions
    groupAgendasByConferenceDays(agendas) {
        const conferenceDays = {};
        
        if (!agendas || agendas.length === 0) {
            return conferenceDays;
        }
        
        agendas.forEach(agenda => {
            if (agenda.conference && agenda.date) {
                const conferenceId = agenda.conference.id;
                const conferenceKey = `${conferenceId}-${agenda.conference.conf_name}`;
                
                if (!conferenceDays[conferenceKey]) {
                    conferenceDays[conferenceKey] = {
                        conference: agenda.conference,
                        days: {}
                    };
                }
                
                // Calculate which day this agenda belongs to
                const dayNumber = this.calculateConferenceDay(agenda.conference, agenda.date);
                const dayKey = `Day ${dayNumber}`;
                
                if (!conferenceDays[conferenceKey].days[dayKey]) {
                    conferenceDays[conferenceKey].days[dayKey] = {
                        date: agenda.date,
                        sessions: {}
                    };
                }
                
                // Group by session within the day
                const sessionName = this.getSessionFromTime(agenda.start_time) || agenda.session || 'General';
                
                if (!conferenceDays[conferenceKey].days[dayKey].sessions[sessionName]) {
                    conferenceDays[conferenceKey].days[dayKey].sessions[sessionName] = [];
                }
                
                conferenceDays[conferenceKey].days[dayKey].sessions[sessionName].push(agenda);
            }
        });
        
        return conferenceDays;
    }

    // ✅ NEW: Determine session based on time
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

    // ✅ NEW: Calculate which day of the conference this date represents
    calculateConferenceDay(conference, targetDate) {
        if (!conference || !conference.start_date || !targetDate) {
            return 1;
        }
        
        const startDate = new Date(conference.start_date);
        const agendaDate = new Date(targetDate);
        
        // Calculate the difference in days
        const timeDiff = agendaDate.getTime() - startDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        return dayDiff + 1; // Day 1, Day 2, etc.
    }

    addTableHeader(agendas = []) {
        const tableWidth = this.pageWidth - (this.margin * 2);
        const uniqueRooms = this.getUniqueRooms(agendas);
        const numberOfRooms = uniqueRooms.length;
        
        const colWidths = {
            time: 45,
            room: (tableWidth - 45) / numberOfRooms
        };

        // Header background
        this.pdf.setFillColor(31, 81, 153);
        this.pdf.rect(this.margin, this.currentY, tableWidth, 20, 'F');
        
        // Header borders
        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(255, 255, 255);
        
        let currentX = this.margin;
        
        // Time column header
        this.pdf.rect(currentX, this.currentY, colWidths.time, 20);
        this.pdf.setFontSize(9);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.text("TIME", currentX + 3, this.currentY + 7);
        this.pdf.setFontSize(7);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.text("Schedule", currentX + 3, this.currentY + 14);
        currentX += colWidths.time;
        
        // Room headers - dynamically generated
        for (let i = 0; i < uniqueRooms.length; i++) {
            const room = uniqueRooms[i];
            this.pdf.rect(currentX, this.currentY, colWidths.room, 20);
            
            // Room name (truncate if too long)
            this.pdf.setFontSize(8);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(255, 255, 255);
            
            let roomDisplayName = room;
            if (room.length > 15) {
                roomDisplayName = room.substring(0, 12) + "...";
            }
            
            this.pdf.text(roomDisplayName.toUpperCase(), currentX + 3, this.currentY + 7);
            
            // Sub header
            this.pdf.setFontSize(6);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.text("Conference Room", currentX + 3, this.currentY + 14);
            
            currentX += colWidths.room;
        }
        
        this.currentY += 20;
        
        // Store rooms for later use
        this.currentRooms = uniqueRooms;
    }

    addAgendaTableRows(agendas) {
        if (!agendas || agendas.length === 0) {
            this.addNoDataRow();
            return;
        }

        // Group agendas by time slots and rooms
        const timeSlots = this.groupAgendasByTimeAndRoom(agendas);
        
        const tableWidth = this.pageWidth - (this.margin * 2);
        const numberOfRooms = this.currentRooms.length;
        const colWidths = {
            time: 45,
            room: (tableWidth - 45) / numberOfRooms
        };

        let rowIndex = 0;
        const sortedTimeSlots = Object.keys(timeSlots).sort();
        
        for (let t = 0; t < sortedTimeSlots.length; t++) {
            const timeSlot = sortedTimeSlots[t];
            this.checkPageBreak(40);
            
            const isEvenRow = rowIndex % 2 === 0;
            const rowHeight = this.calculateRowHeight(timeSlots[timeSlot], colWidths.room);
            
            // Row background
            if (isEvenRow) {
                this.pdf.setFillColor(245, 245, 245);
                this.pdf.rect(this.margin, this.currentY, tableWidth, rowHeight, 'F');
            }
            
            let currentX = this.margin;
            
            // Time column
            this.pdf.setLineWidth(0.3);
            this.pdf.setDrawColor(206, 212, 218);
            this.pdf.rect(currentX, this.currentY, colWidths.time, rowHeight);
            
            this.pdf.setFontSize(8);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(33, 37, 41);
            
            const timeText = timeSlot === 'break' ? 'BREAK' : this.formatTimeSlot(timeSlot);
            const timeLines = timeText.split('\n');
            let timeY = this.currentY + 8;
            
            for (let i = 0; i < timeLines.length; i++) {
                this.pdf.text(timeLines[i], currentX + 2, timeY);
                timeY += 6;
            }
            
            currentX += colWidths.time;
            
            // Content columns for each room
            for (let i = 0; i < this.currentRooms.length; i++) {
                const room = this.currentRooms[i];
                this.pdf.rect(currentX, this.currentY, colWidths.room, rowHeight);
                
                // Find agenda for this room and time slot
                const agendaForRoom = timeSlots[timeSlot].find(agenda => 
                    agenda && agenda.location === room
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
        const padding = 3;
        let textY = y + padding + 6;
        
        // Event type
        this.pdf.setFontSize(6);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        
        const eventType = this.capitalize(agenda.type || 'Session');
        this.pdf.text(eventType.toUpperCase(), x + padding, textY);
        textY += 5;
        
        // Title
        this.pdf.setFontSize(7);
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
            textY += 5;
        } else {
            textY += 1;
        }
        
        // Speaker
        if (agenda.speaker && textY < y + height - 6) {
            this.pdf.setFontSize(6);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            
            const speakerText = "Speaker: " + agenda.speaker;
            const speakerLines = this.pdf.splitTextToSize(speakerText, width - padding * 2);
            this.pdf.text(speakerLines[0], x + padding, textY);
        }
    }

    // ✅ Updated to group by time and room
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
        let maxHeight = 28; // Reduced minimum height
        
        for (let i = 0; i < agendas.length; i++) {
            const agenda = agendas[i];
            if (agenda) {
                // Calculate height based on title length
                const titleLines = this.pdf.splitTextToSize(agenda.title, colWidth - 6);
                const estimatedHeight = 16 + (Math.min(titleLines.length, 2) * 4) + (agenda.speaker ? 6 : 0);
                maxHeight = Math.max(maxHeight, estimatedHeight);
            }
        }
        
        return Math.min(maxHeight, 50); // Reduced cap to 50
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
        const rowHeight = 40;
        
        // Empty row background
        this.pdf.setFillColor(250, 250, 250);
        this.pdf.rect(this.margin, this.currentY, tableWidth, rowHeight, 'F');
        
        // Border
        this.pdf.setLineWidth(0.3);
        this.pdf.setDrawColor(206, 212, 218);
        this.pdf.rect(this.margin, this.currentY, tableWidth, rowHeight);
        
        // No data message
        this.pdf.setFontSize(12);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text("NO AGENDA ITEMS FOUND", this.pageWidth / 2, this.currentY + 18, { align: 'center' });
        
        this.pdf.setFontSize(9);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.text("No agenda items match the current filters.", this.pageWidth / 2, this.currentY + 28, { align: 'center' });
        
        this.currentY += rowHeight + 5;
    }

    addFooter() {
        const totalPages = this.pdf.internal.getNumberOfPages();
        const currentPage = this.pdf.internal.getCurrentPageInfo().pageNumber;
        
        // Footer line
        this.pdf.setLineWidth(0.3);
        this.pdf.setDrawColor(206, 212, 218);
        this.pdf.line(this.margin, this.pageHeight - 20, this.pageWidth - this.margin, this.pageHeight - 20);
        
        // Footer text
        this.pdf.setFontSize(8);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        
        const footerLeft = "Conference Management System";
        const footerCenter = "Generated on " + new Date().toLocaleDateString('en-US');
        const footerRight = "Page " + currentPage + " of " + totalPages;
        
        this.pdf.text(footerLeft, this.margin, this.pageHeight - 12);
        this.pdf.text(footerCenter, this.pageWidth / 2, this.pageHeight - 12, { align: 'center' });
        this.pdf.text(footerRight, this.pageWidth - this.margin, this.pageHeight - 12, { align: 'right' });
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
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
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
        
        // Group agendas by conference days
        const conferenceDays = this.groupAgendasByConferenceDays(agendas);
        
        // Add cover page
        this.addCoverPage(agendas, conferenceDays, exportDate);
        
        // Generate content for each conference and its days
        const conferenceKeys = Object.keys(conferenceDays);
        
        if (conferenceKeys.length === 0) {
            // No conferences found, add new page and use original method
            this.pdf.addPage();
            this.currentY = this.margin;
            this.addHeader('CONFERENCE AGENDA', 'Official Schedule Overview - ' + exportDate);
            this.addExportInfo(exportDate, agendas ? agendas.length : 0, filters);
            this.addTableHeader(agendas);
            this.addAgendaTableRows(agendas);
        } else {
            // Generate day-by-day schedule for each conference
            for (let i = 0; i < conferenceKeys.length; i++) {
                const conferenceKey = conferenceKeys[i];
                const conferenceData = conferenceDays[conferenceKey];
                
                // Add new page for conference content
                this.pdf.addPage();
                this.currentY = this.margin;
                
                this.addConferenceHeader(conferenceData.conference);
                
                // Generate schedule for each day
                const dayKeys = Object.keys(conferenceData.days).sort();
                
                for (let j = 0; j < dayKeys.length; j++) {
                    const dayKey = dayKeys[j];
                    const dayData = conferenceData.days[dayKey];
                    
                    // Add day header
                    this.addDayHeader(dayKey, dayData.date);
                    
                    // Generate schedule for each session within the day
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
                        
                        // Add session header
                        this.addSessionHeader(sessionKey);
                        
                        // Add table header for this session
                        this.addTableHeader(sessionAgendas);
                        
                        // Add agenda items for this session
                        this.addAgendaTableRows(sessionAgendas);
                        
                        // Add smaller spacing between sessions
                        if (k < sessionKeys.length - 1) {
                            this.currentY += 10;
                        }
                    }
                    
                    // Add spacing between days
                    if (j < dayKeys.length - 1) {
                        this.currentY += 15;
                        this.checkPageBreak(50);
                    }
                }
                
                // Add page break between conferences
                if (i < conferenceKeys.length - 1) {
                    this.currentY += 20;
                }
            }
        }
        
        // Add footers to all pages
        this.addFootersToAllPages();
        
        // Generate filename and save
        const filename = 'conference-agenda-' + new Date().toISOString().split('T')[0] + '.pdf';
        this.pdf.save(filename);
    }

    generateSingleAgendaPDF(agenda) {
        // Add cover page with single agenda details (without description)
        this.addSingleAgendaCoverPage(agenda);
        
        // Add page 2 with description
        this.pdf.addPage();
        this.currentY = this.margin;
        this.addDescriptionPage(agenda);
        
        // Add footer
        this.addFootersToAllPages();
        
        // Generate filename and save
        const cleanTitle = agenda && agenda.title ? agenda.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : 'unknown';
        const agendaId = agenda && agenda.id ? agenda.id : 'unknown';
        const dayNumber = agenda && agenda.conference ? this.calculateConferenceDay(agenda.conference, agenda.date) : '';
        const dayPrefix = dayNumber ? `day${dayNumber}-` : '';
        const filename = `agenda-${dayPrefix}${agendaId}-${cleanTitle}.pdf`;
        this.pdf.save(filename);
    }

    addSingleItemDetails(agenda) {
        const cardWidth = this.pageWidth - (this.margin * 2);
        
        // Main card background
        this.pdf.setFillColor(248, 250, 252);
        this.pdf.rect(this.margin, this.currentY, cardWidth, 140, 'F');
        
        // Border
        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(31, 81, 153);
        this.pdf.rect(this.margin, this.currentY, cardWidth, 140);
        
        // Content
        let contentY = this.currentY + 15;
        
        // Title
        this.pdf.setFontSize(16);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text(agenda.title || 'Untitled Session', this.margin + 10, contentY);
        contentY += 15;
        
        // Details in two columns
        const details = [
            { label: 'Time:', value: this.formatTime(agenda.start_time) + ' - ' + this.formatTime(agenda.end_time) },
            { label: 'Date:', value: this.formatDate(agenda.date) },
            { label: 'Conference Day:', value: agenda.conference ? `Day ${this.calculateConferenceDay(agenda.conference, agenda.date)}` : 'N/A' },
            { label: 'Type:', value: this.capitalize(agenda.type || 'Session') },
            { label: 'Speaker:', value: agenda.speaker || 'TBA' },
            { label: 'Room:', value: agenda.location || 'TBA' }, // ✅ Changed from Location to Room
            { label: 'Conference:', value: (agenda.conference && agenda.conference.conf_name) ? agenda.conference.conf_name : 'N/A' },
            { label: 'Session:', value: this.capitalize(agenda.session || 'N/A') },
            { label: 'ID:', value: '#' + (agenda.id || 'Unknown') }
        ];
        
        for (let i = 0; i < details.length; i++) {
            const detail = details[i];
            const isLeftColumn = i % 2 === 0;
            const xPos = isLeftColumn ? this.margin + 10 : this.margin + (cardWidth / 2) + 10;
            const yPos = contentY + Math.floor(i / 2) * 12;
            
            this.pdf.setFontSize(10);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(33, 37, 41);
            this.pdf.text(detail.label, xPos, yPos);
            
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            this.pdf.text(detail.value, xPos + 45, yPos);
        }
        
        contentY += Math.ceil(details.length / 2) * 12 + 15;
        
        // Description
        if (agenda.description) {
            this.pdf.setFontSize(10);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(33, 37, 41);
            this.pdf.text('Description:', this.margin + 10, contentY);
            contentY += 8;
            
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            const descLines = this.pdf.splitTextToSize(agenda.description, cardWidth - 20);
            this.pdf.text(descLines, this.margin + 10, contentY);
        }
        
        this.currentY += 150;
    }

    addFootersToAllPages() {
        const totalPages = this.pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            this.pdf.setPage(i);
            this.addFooter();
        }
    }

    // ✅ NEW: Add conference-specific header
    addConferenceHeader(conference) {
        this.checkPageBreak(30);
        
        // Conference header background
        this.pdf.setFillColor(245, 248, 252);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 28, 'F');
        
        // Border
        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(31, 81, 153);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 28);
        
        // Conference name
        this.pdf.setFontSize(13);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text(conference.conf_name || 'Conference', this.margin + 8, this.currentY + 12);
        
        // Conference dates
        this.pdf.setFontSize(9);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        
        const startDate = conference.start_date ? this.formatDate(conference.start_date) : 'TBA';
        const endDate = conference.end_date ? this.formatDate(conference.end_date) : 'TBA';
        const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
        
        this.pdf.text(`Conference Period: ${dateRange}`, this.margin + 8, this.currentY + 21);
        
        // Location if available
        if (conference.location) {
            this.pdf.text(`Venue: ${conference.location}`, this.margin + 200, this.currentY + 21);
        }
        
        this.currentY += 35;
    }

    // ✅ NEW: Add day-specific header
    addDayHeader(dayTitle, date) {
        this.checkPageBreak(22);
        
        // Day header background
        this.pdf.setFillColor(31, 81, 153);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 20, 'F');
        
        // Day title
        this.pdf.setFontSize(11);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.text(dayTitle.toUpperCase(), this.margin + 8, this.currentY + 8);
        
        // Date
        this.pdf.setFontSize(9);
        this.pdf.setFont("helvetica", "normal");
        const formattedDate = this.formatDate(date);
        this.pdf.text(formattedDate, this.margin + 8, this.currentY + 16);
        
        this.currentY += 25;
    }

    // ✅ NEW: Add session-specific header
    addSessionHeader(sessionTitle) {
        this.checkPageBreak(18);
        
        // Session header background
        this.pdf.setFillColor(248, 250, 252);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 15, 'F');
        
        // Border
        this.pdf.setLineWidth(0.3);
        this.pdf.setDrawColor(156, 163, 175);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 15);
        
        // Session title
        this.pdf.setFontSize(10);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text(sessionTitle.toUpperCase(), this.margin + 6, this.currentY + 10);
        
        this.currentY += 18;
    }

    // ✅ NEW: Add cover page
    addCoverPage(agendas, conferenceDays, exportDate) {
        // Cover page background gradient effect
        this.pdf.setFillColor(245, 248, 252);
        this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
        
        // Main title
        this.pdf.setFontSize(24);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("CONFERENCE AGENDA", this.pageWidth / 2, 60, { align: 'center' });
        
        // Subtitle
        this.pdf.setFontSize(14);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text("Official Schedule & Program Guide", this.pageWidth / 2, 80, { align: 'center' });
        
        // Date
        this.pdf.setFontSize(12);
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Generated: " + exportDate, this.pageWidth / 2, 100, { align: 'center' });
        
        // Add some basic info on cover page
        this.addCoverPageBasicInfo(agendas);
        
        // Footer on cover page
        this.addCoverPageFooter();
        
        // Add page 2 with important information
        this.pdf.addPage();
        this.currentY = this.margin;
        this.addImportantInformationPage();
    }

    // ✅ NEW: Add conference overview
    addConferenceOverview(conferenceDays) {
        const conferenceKeys = Object.keys(conferenceDays);
        
        if (conferenceKeys.length === 0) {
            return;
        }
        
        // Section header
        this.pdf.setFontSize(16);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Conference Overview", this.margin, this.currentY);
        this.currentY += 20;
        
        // List conferences
        for (let i = 0; i < conferenceKeys.length; i++) {
            const conferenceData = conferenceDays[conferenceKeys[i]];
            const conference = conferenceData.conference;
            
            // Conference card background
            this.pdf.setFillColor(255, 255, 255);
            this.pdf.rect(this.margin, this.currentY - 5, this.pageWidth - (this.margin * 2), 45, 'F');
            
            // Border
            this.pdf.setLineWidth(0.5);
            this.pdf.setDrawColor(206, 212, 218);
            this.pdf.rect(this.margin, this.currentY - 5, this.pageWidth - (this.margin * 2), 45);
            
            // Conference name
            this.pdf.setFontSize(14);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(33, 37, 41);
            this.pdf.text(conference.conf_name || 'Conference', this.margin + 10, this.currentY + 8);
            
            // Date range
            this.pdf.setFontSize(10);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            
            const startDate = conference.start_date ? this.formatDate(conference.start_date) : 'TBA';
            const endDate = conference.end_date ? this.formatDate(conference.end_date) : 'TBA';
            const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
            
            this.pdf.text("Date: " + dateRange, this.margin + 10, this.currentY + 20);
            
            // Location
            if (conference.location) {
                this.pdf.text("Venue: " + conference.location, this.margin + 10, this.currentY + 30);
            }
            
            // Number of days
            const dayCount = Object.keys(conferenceData.days).length;
            this.pdf.text(`Duration: ${dayCount} day(s)`, this.margin + 200, this.currentY + 20);
            
            this.currentY += 55;
        }
    }

    // ✅ NEW: Add agenda statistics
    addAgendaStatistics(agendas, conferenceDays) {
        // Section header
        this.pdf.setFontSize(16);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Agenda Statistics", this.margin, this.currentY);
        this.currentY += 20;
        
        // Statistics cards
        const stats = this.calculateStatistics(agendas, conferenceDays);
        const cardWidth = (this.pageWidth - (this.margin * 2) - 30) / 4;
        
        let cardX = this.margin;
        
        // Total Events
        this.addStatCard("Total Events", stats.totalEvents, cardX, this.currentY, cardWidth);
        cardX += cardWidth + 10;
        
        // Total Days
        this.addStatCard("Conference Days", stats.totalDays, cardX, this.currentY, cardWidth);
        cardX += cardWidth + 10;
        
        // Total Rooms
        this.addStatCard("Rooms Used", stats.totalRooms, cardX, this.currentY, cardWidth);
        cardX += cardWidth + 10;
        
        // Sessions
        this.addStatCard("Total Sessions", stats.totalSessions, cardX, this.currentY, cardWidth);
        
        this.currentY += 60;
    }

    // ✅ NEW: Add individual stat card
    addStatCard(title, value, x, y, width) {
        // Card background
        this.pdf.setFillColor(255, 255, 255);
        this.pdf.rect(x, y, width, 40, 'F');
        
        // Border
        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(31, 81, 153);
        this.pdf.rect(x, y, width, 40);
        
        // Value
        this.pdf.setFontSize(18);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text(value.toString(), x + width/2, y + 18, { align: 'center' });
        
        // Title
        this.pdf.setFontSize(9);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text(title, x + width/2, y + 30, { align: 'center' });
    }

    // ✅ NEW: Calculate statistics
    calculateStatistics(agendas, conferenceDays) {
        const stats = {
            totalEvents: agendas ? agendas.length : 0,
            totalDays: 0,
            totalRooms: new Set(),
            totalSessions: new Set()
        };
        
        Object.values(conferenceDays).forEach(conferenceData => {
            stats.totalDays += Object.keys(conferenceData.days).length;
            
            Object.values(conferenceData.days).forEach(dayData => {
                Object.keys(dayData.sessions).forEach(session => {
                    stats.totalSessions.add(session);
                });
            });
        });
        
        if (agendas) {
            agendas.forEach(agenda => {
                if (agenda.location) {
                    stats.totalRooms.add(agenda.location);
                }
            });
        }
        
        return {
            totalEvents: stats.totalEvents,
            totalDays: stats.totalDays,
            totalRooms: stats.totalRooms.size,
            totalSessions: stats.totalSessions.size
        };
    }

    // ✅ NEW: Add important information
    addImportantInformation() {
        // Section header
        this.pdf.setFontSize(16);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Important Information", this.margin, this.currentY);
        this.currentY += 20;
        
        // Info box
        this.pdf.setFillColor(255, 255, 255);
        this.pdf.rect(this.margin, this.currentY - 5, this.pageWidth - (this.margin * 2), 50, 'F');
        
        // Border
        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(206, 212, 218);
        this.pdf.rect(this.margin, this.currentY - 5, this.pageWidth - (this.margin * 2), 50);
        
        // Information text
        this.pdf.setFontSize(10);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        
        const infoLines = [
            "• Please arrive 15 minutes before your scheduled session",
            "• All times are displayed in local time zone",
            "• Room assignments may be subject to change - check for updates",
            "• Contact conference organizers for any schedule conflicts",
            "• This document was generated electronically and is valid without signature"
        ];
        
        let infoY = this.currentY + 8;
        infoLines.forEach(line => {
            this.pdf.text(line, this.margin + 10, infoY);
            infoY += 8;
        });
        
        this.currentY += 55;
    }

    // ✅ NEW: Add cover page footer
    addCoverPageFooter() {
        // Footer line
        this.pdf.setLineWidth(0.3);
        this.pdf.setDrawColor(206, 212, 218);
        this.pdf.line(this.margin, this.pageHeight - 30, this.pageWidth - this.margin, this.pageHeight - 30);
        
        // Footer text
        this.pdf.setFontSize(10);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Conference Management System", this.pageWidth / 2, this.pageHeight - 20, { align: 'center' });
        
        this.pdf.setFontSize(8);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text("Professional Conference & Event Management Solution", this.pageWidth / 2, this.pageHeight - 12, { align: 'center' });
    }

    // ✅ NEW: Add basic info on cover page (replacing statistics)
    addCoverPageBasicInfo(agendas) {
        this.currentY = 130;
        
        // Simple welcome message
        this.pdf.setFontSize(14);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Welcome to the Conference", this.pageWidth / 2, this.currentY, { align: 'center' });
        
        this.currentY += 20;
        
        // Basic statistics in a simple format
        if (agendas && agendas.length > 0) {
            this.pdf.setFontSize(12);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            
            const totalEvents = agendas.length;
            const uniqueRooms = new Set();
            agendas.forEach(agenda => {
                if (agenda.location) uniqueRooms.add(agenda.location);
            });
            
            this.pdf.text(`This agenda contains ${totalEvents} events across ${uniqueRooms.size} rooms.`, this.pageWidth / 2, this.currentY, { align: 'center' });
            this.currentY += 15;
            this.pdf.text("Please refer to the following pages for detailed schedules.", this.pageWidth / 2, this.currentY, { align: 'center' });
        }
    }

    // ✅ NEW: Add important information as dedicated page 2
    addImportantInformationPage() {
        // Page title
        this.pdf.setFontSize(18);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Important Information & Guidelines", this.pageWidth / 2, this.currentY + 10, { align: 'center' });
        this.currentY += 40;
        
        // Guidelines section
        this.pdf.setFontSize(14);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Conference Guidelines", this.margin, this.currentY);
        this.currentY += 20;
        
        // Guidelines list
        this.pdf.setFontSize(11);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(33, 37, 41);
        
        const guidelines = [
            "• Please arrive 15 minutes before your scheduled session",
            "• All times are displayed in local time zone",
            "• Room assignments may be subject to change - check for updates",
            "• Mobile devices should be set to silent mode during sessions",
            "• Photography is allowed unless otherwise specified",
            "• Emergency exits are clearly marked throughout the venue"
        ];
        
        guidelines.forEach(guideline => {
            this.pdf.text(guideline, this.margin, this.currentY);
            this.currentY += 15;
        });
        
        this.currentY += 20;
        
        // Contact information
        this.pdf.setFontSize(14);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Contact Information", this.margin, this.currentY);
        this.currentY += 20;
        
        this.pdf.setFontSize(11);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(33, 37, 41);
        
        const contacts = [
            "• For schedule conflicts or changes: Contact conference organizers",
            "• Technical support: Available at the registration desk",
            "• Medical assistance: First aid station located at main entrance",
            "• Lost and found: Located at the information desk",
            "• Catering inquiries: Contact venue staff"
        ];
        
        contacts.forEach(contact => {
            this.pdf.text(contact, this.margin, this.currentY);
            this.currentY += 15;
        });
        
        this.currentY += 20;
        
        // Document information
        this.pdf.setFontSize(14);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Document Information", this.margin, this.currentY);
        this.currentY += 20;
        
        this.pdf.setFontSize(11);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(33, 37, 41);
        
        const docInfo = [
            "• This document was generated electronically and is valid without signature",
            "• For the most up-to-date schedule, check the conference website",
            "• Schedule changes will be announced via official conference channels",
            "• Keep this document handy throughout the conference"
        ];
        
        docInfo.forEach(info => {
            this.pdf.text(info, this.margin, this.currentY);
            this.currentY += 15;
        });
    }

    // ✅ NEW: Add single agenda cover page (compact design)
    addSingleAgendaCoverPage(agenda) {
        // Cover page background
        this.pdf.setFillColor(245, 248, 252);
        this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
        
        // Main title
        this.pdf.setFontSize(20);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("AGENDA ITEM DETAILS", this.pageWidth / 2, 40, { align: 'center' });
        
        if (!agenda) {
            this.pdf.setFontSize(12);
            this.pdf.text("No agenda data available", this.pageWidth / 2, 60, { align: 'center' });
            return;
        }
        
        // Event title
        this.pdf.setFontSize(16);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(33, 37, 41);
        
        const titleLines = this.pdf.splitTextToSize(agenda.title || 'Untitled Event', this.pageWidth - 60);
        let titleY = 70;
        titleLines.forEach(line => {
            this.pdf.text(line, this.pageWidth / 2, titleY, { align: 'center' });
            titleY += 12;
        });
        
        // Main details card
        const cardY = titleY + 20;
        const cardHeight = 140; // Reduced height since no description
        
        // Card background
        this.pdf.setFillColor(255, 255, 255);
        this.pdf.rect(this.margin, cardY, this.pageWidth - (this.margin * 2), cardHeight, 'F');
        
        // Card border
        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(31, 81, 153);
        this.pdf.rect(this.margin, cardY, this.pageWidth - (this.margin * 2), cardHeight);
        
        // Details content
        let contentY = cardY + 15; // Reduced padding
        
        // Conference info (if available)
        if (agenda.conference) {
            this.pdf.setFontSize(14);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(31, 81, 153);
            this.pdf.text(agenda.conference.conf_name, this.margin + 10, contentY);
            
            const dayNumber = this.calculateConferenceDay(agenda.conference, agenda.date);
            this.pdf.setFontSize(10);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.text(`Day ${dayNumber}`, this.pageWidth - this.margin - 10, contentY, { align: 'right' });
            contentY += 18;
        }
        
        // Two-column layout for details
        const leftCol = this.margin + 10;
        const rightCol = this.pageWidth / 2 + 5;
        
        const details = [
            { label: 'Date:', value: this.formatDate(agenda.date), side: 'left' },
            { label: 'Time:', value: `${this.formatTime(agenda.start_time)} - ${this.formatTime(agenda.end_time)}`, side: 'right' },
            { label: 'Room:', value: agenda.location || 'TBA', side: 'left' },
            { label: 'Type:', value: this.capitalize(agenda.type || 'Session'), side: 'right' },
            { label: 'Speaker:', value: agenda.speaker || 'TBA', side: 'left' },
            { label: 'Session:', value: this.capitalize(agenda.session || 'N/A'), side: 'right' },
            { label: 'ID:', value: '#' + (agenda.id || 'Unknown'), side: 'left' }
        ];
        
        let leftY = contentY;
        let rightY = contentY;
        
        details.forEach(detail => {
            const xPos = detail.side === 'left' ? leftCol : rightCol;
            const currentY = detail.side === 'left' ? leftY : rightY;
            
            // Label
            this.pdf.setFontSize(10);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(33, 37, 41);
            this.pdf.text(detail.label, xPos, currentY);
            
            // Value
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            this.pdf.text(detail.value, xPos + 30, currentY);
            
            if (detail.side === 'left') {
                leftY += 12; // Reduced spacing
            } else {
                rightY += 12; // Reduced spacing
            }
        });
        
        // Note about description on page 2
        if (agenda.description && agenda.description.trim()) {
            const noteY = Math.max(leftY, rightY) + 10;
            
            this.pdf.setFontSize(9);
            this.pdf.setFont("helvetica", "italic");
            this.pdf.setTextColor(73, 80, 87);
            this.pdf.text('Event description available on page 2', this.pageWidth / 2, noteY, { align: 'center' });
        }
        
        // Generation info (moved higher and cleaner)
        const infoY = cardY + cardHeight + 20;
        this.pdf.setFontSize(9);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, this.pageWidth / 2, infoY, { align: 'center' });
        
        // Clean footer line
        const footerLineY = this.pageHeight - 25;
        this.pdf.setLineWidth(0.3);
        this.pdf.setDrawColor(206, 212, 218);
        this.pdf.line(this.margin, footerLineY, this.pageWidth - this.margin, footerLineY);
        
        // Clean footer text
        this.pdf.setFontSize(8);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setTextColor(73, 80, 87);
        this.pdf.text("Conference Management System", this.pageWidth / 2, footerLineY + 10, { align: 'center' });
    }

    // ✅ NEW: Add description page for single agenda
    addDescriptionPage(agenda) {
        // Page title
        this.pdf.setFontSize(18);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        this.pdf.text("Event Description", this.pageWidth / 2, this.currentY + 10, { align: 'center' });
        this.currentY += 30;
        
        // Event title
        this.pdf.setFontSize(14);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(33, 37, 41);
        this.pdf.text(agenda.title || 'Untitled Event', this.pageWidth / 2, this.currentY, { align: 'center' });
        this.currentY += 25;
        
        // Description content
        if (agenda.description && agenda.description.trim()) {
            // Description box
            const boxHeight = this.pageHeight - this.currentY - 60;
            
            this.pdf.setFillColor(248, 250, 252);
            this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), boxHeight, 'F');
            
            // Border
            this.pdf.setLineWidth(0.5);
            this.pdf.setDrawColor(206, 212, 218);
            this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), boxHeight);
            
            // Description text
            this.pdf.setFontSize(11);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(33, 37, 41);
            
            const maxWidth = this.pageWidth - (this.margin * 2) - 20;
            const descLines = this.pdf.splitTextToSize(agenda.description, maxWidth);
            
            let descY = this.currentY + 15;
            descLines.forEach(line => {
                if (descY < this.currentY + boxHeight - 15) {
                    this.pdf.text(line, this.margin + 10, descY);
                    descY += 12;
                }
            });
        } else {
            // No description available
            this.pdf.setFontSize(12);
            this.pdf.setFont("helvetica", "italic");
            this.pdf.setTextColor(73, 80, 87);
            this.pdf.text("No description available for this event.", this.pageWidth / 2, this.currentY + 50, { align: 'center' });
        }
    }
}