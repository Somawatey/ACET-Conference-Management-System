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

    addTableHeader() {
        const tableWidth = this.pageWidth - (this.margin * 2);
        const colWidths = {
            time: 50,
            location1: (tableWidth - 50) / 4,
            location2: (tableWidth - 50) / 4,
            location3: (tableWidth - 50) / 4,
            location4: (tableWidth - 50) / 4
        };

        // Header background
        this.pdf.setFillColor(31, 81, 153);
        this.pdf.rect(this.margin, this.currentY, tableWidth, 25, 'F');
        
        // Header borders
        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(255, 255, 255);
        
        let currentX = this.margin;
        
        // Time column header
        this.pdf.rect(currentX, this.currentY, colWidths.time, 25);
        this.pdf.setFontSize(10);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.text("TIME", currentX + 5, this.currentY + 8);
        this.pdf.setFontSize(8);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.text("Schedule", currentX + 5, this.currentY + 16);
        currentX += colWidths.time;
        
        // Location headers
        const locations = ["CONFERENCE HALL A", "CONFERENCE HALL B", "MEETING ROOM C", "MEETING ROOM D"];
        const locationCodes = ["Hall A", "Hall B", "Room C", "Room D"];
        
        for (let i = 0; i < locations.length; i++) {
            this.pdf.rect(currentX, this.currentY, colWidths.location1, 25);
            
            // Location name
            this.pdf.setFontSize(9);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(255, 255, 255);
            this.pdf.text(locationCodes[i], currentX + 5, this.currentY + 8);
            
            // Sub header
            this.pdf.setFontSize(7);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.text("Conference Area", currentX + 5, this.currentY + 16);
            
            currentX += colWidths.location1;
        }
        
        this.currentY += 25;
    }

    addAgendaTableRows(agendas) {
        if (!agendas || agendas.length === 0) {
            this.addNoDataRow();
            return;
        }

        // Group agendas by time slots
        const timeSlots = this.groupAgendasByTime(agendas);
        
        const tableWidth = this.pageWidth - (this.margin * 2);
        const colWidths = {
            time: 50,
            location: (tableWidth - 50) / 4
        };

        let rowIndex = 0;
        const sortedTimeSlots = Object.keys(timeSlots).sort();
        
        for (let t = 0; t < sortedTimeSlots.length; t++) {
            const timeSlot = sortedTimeSlots[t];
            this.checkPageBreak(50);
            
            const isEvenRow = rowIndex % 2 === 0;
            const rowHeight = this.calculateRowHeight(timeSlots[timeSlot], colWidths.location);
            
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
            
            this.pdf.setFontSize(9);
            this.pdf.setFont("helvetica", "bold");
            this.pdf.setTextColor(33, 37, 41);
            
            const timeText = timeSlot === 'break' ? 'BREAK' : this.formatTimeSlot(timeSlot);
            const timeLines = timeText.split('\n');
            let timeY = this.currentY + 10;
            
            for (let i = 0; i < timeLines.length; i++) {
                this.pdf.text(timeLines[i], currentX + 3, timeY);
                timeY += 8;
            }
            
            currentX += colWidths.time;
            
            // Content columns
            for (let i = 0; i < 4; i++) {
                this.pdf.rect(currentX, this.currentY, colWidths.location, rowHeight);
                
                if (timeSlots[timeSlot][i]) {
                    this.addCellContent(timeSlots[timeSlot][i], currentX, this.currentY, colWidths.location, rowHeight);
                }
                
                currentX += colWidths.location;
            }
            
            this.currentY += rowHeight;
            rowIndex++;
        }
    }

    addCellContent(agenda, x, y, width, height) {
        const padding = 4;
        let textY = y + padding + 8;
        
        // Event type
        this.pdf.setFontSize(7);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(31, 81, 153);
        
        const eventType = this.capitalize(agenda.type || 'Session');
        this.pdf.text(eventType.toUpperCase(), x + padding, textY);
        textY += 6;
        
        // Title
        this.pdf.setFontSize(8);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setTextColor(33, 37, 41);
        
        const titleLines = this.pdf.splitTextToSize(agenda.title, width - padding * 2);
        const maxLines = Math.min(titleLines.length, 2);
        for (let i = 0; i < maxLines; i++) {
            this.pdf.text(titleLines[i], x + padding, textY);
            textY += 5;
        }
        
        if (titleLines.length > 2) {
            this.pdf.text("...", x + padding, textY);
            textY += 6;
        } else {
            textY += 2;
        }
        
        // Speaker
        if (agenda.speaker && textY < y + height - 8) {
            this.pdf.setFontSize(7);
            this.pdf.setFont("helvetica", "normal");
            this.pdf.setTextColor(73, 80, 87);
            
            const speakerText = "Speaker: " + agenda.speaker;
            const speakerLines = this.pdf.splitTextToSize(speakerText, width - padding * 2);
            this.pdf.text(speakerLines[0], x + padding, textY);
        }
        
        // Location indicator if available
        if (agenda.location && textY < y + height - 12) {
            this.pdf.setFontSize(6);
            this.pdf.setFont("helvetica", "italic");
            this.pdf.setTextColor(73, 80, 87);
            this.pdf.text("Location: " + agenda.location, x + padding, textY + 8);
        }
    }

    groupAgendasByTime(agendas) {
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
        let maxHeight = 35; // Minimum height
        
        for (let i = 0; i < agendas.length; i++) {
            const agenda = agendas[i];
            if (agenda) {
                // Calculate height based on title length
                const titleLines = this.pdf.splitTextToSize(agenda.title, colWidth - 8);
                const estimatedHeight = 20 + (Math.min(titleLines.length, 2) * 5) + (agenda.speaker ? 8 : 0) + (agenda.location ? 8 : 0);
                maxHeight = Math.max(maxHeight, estimatedHeight);
            }
        }
        
        return Math.min(maxHeight, 65); // Cap at 65 to prevent overly tall rows
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
        
        // Add header
        this.addHeader('CONFERENCE AGENDA', 'Official Schedule Overview - ' + exportDate);
        
        // Add export info
        this.addExportInfo(exportDate, agendas ? agendas.length : 0, filters);
        
        // Add table header
        this.addTableHeader();
        
        // Add agenda items as table rows
        this.addAgendaTableRows(agendas);
        
        // Add footers to all pages
        this.addFootersToAllPages();
        
        // Generate filename and save
        const filename = 'conference-agenda-' + new Date().toISOString().split('T')[0] + '.pdf';
        this.pdf.save(filename);
    }

    generateSingleAgendaPDF(agenda) {
        // For single agenda, use a detailed format
        this.addHeader('AGENDA ITEM DETAILS', agenda ? agenda.title : 'Unknown Item');
        
        // Create a detailed single item display
        if (agenda) {
            this.addSingleItemDetails(agenda);
        }
        
        // Add footer
        this.addFootersToAllPages();
        
        // Generate filename and save
        const cleanTitle = agenda && agenda.title ? agenda.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : 'unknown';
        const agendaId = agenda && agenda.id ? agenda.id : 'unknown';
        const filename = 'agenda-details-' + agendaId + '-' + cleanTitle + '.pdf';
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
            { label: 'Type:', value: this.capitalize(agenda.type || 'Session') },
            { label: 'Speaker:', value: agenda.speaker || 'TBA' },
            { label: 'Location:', value: agenda.location || 'TBA' },
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
}