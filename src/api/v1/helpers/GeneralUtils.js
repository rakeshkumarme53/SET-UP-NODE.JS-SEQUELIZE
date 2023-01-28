const TimeUtils = require('./TimeUtils');

class GeneralUtils {
    static getPeriod(period, fromDate, toDate, periodObj) {
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        if (period === 'PreviousMonth') {
            startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            endDate = new Date(date.getFullYear(), date.getMonth(), 0);
        }
        else if (period ==='NextMonth'){
             startDate = new Date(date.getFullYear(), date.getMonth()+1, 1);
         endDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
        }
        else if (period ==='ThisMonth'){
             startDate = new Date(date.getFullYear(), date.getMonth(), 1);
         endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
       }
        else if(period === 'ThisWeek'){
            
             startDate = new Date(date.setDate(date.getDate() - date.getDay()));
             endDate = new Date(date.setDate(date.getDate() - date.getDay()+6)); 
        }
        else if(period === 'NextWeek'){
            var first = date.getDate() - date.getDay() + 7; // First day is the day of the month - the day of the week
            var last = first + 6;
            startDate = new Date(date.setDate(first));
             endDate = new Date(date.setDate(last));
        }

        else if (period === 'PreviousWeek'){
            startDate = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() -7));
            endDate= new Date(new Date().setDate(new Date().getDate() - new Date().getDay() -1));

        }
        else if (period === "ThisQuarter") {
            const quarter = Math.floor(date.getMonth() / 3);
            startDate = new Date(date.getFullYear(), quarter * 3, 1);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
        }
        else if (period === "PreviousQuarter") {
            const quarter = Math.floor((date.getMonth() - 3) / 3);
            startDate = new Date(date.getFullYear(), quarter * 3, 1);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
        }
        else if (period === "ThisYear") {
            startDate = new Date(date.getFullYear(), 0, 1);
            endDate = new Date(date.getFullYear(), 11, 31);
        }
        else if (period === "NextYear") {
            startDate = new Date(date.getFullYear() + 1, 0, 1);
            endDate = new Date(date.getFullYear() + 1, 11, 31);
        }
        else if (period === "PreviousYear") {
            startDate = new Date(date.getFullYear() - 1, 0, 1);
            endDate = new Date(date.getFullYear() - 1, 11, 31);
        }
        else if (period === "Custom") {
            startDate = new Date(fromDate);
            endDate = new Date(toDate);
        }
    
        periodObj.startDate = TimeUtils.getIST(startDate);
        periodObj.endDate = TimeUtils.getIST(endDate);
    }

    static getPreviousPeriod(viewType, startDate, endDate, periodObj) {
        let finalStartDate = startDate;
        let finalEndDate = endDate;
        if(viewType === 'Week'){            
            finalStartDate = new Date(finalStartDate.getFullYear(), finalStartDate.getMonth(), finalStartDate.getDate()-7);
            finalEndDate = new Date(finalStartDate.getFullYear(), finalStartDate.getMonth(), finalEndDate.getDate()-7);
        }
        else if(viewType === 'Month'){            
            finalStartDate = new Date(finalStartDate.getFullYear(), finalStartDate.getMonth() -1, 1);
            finalEndDate = new Date(finalEndDate.getFullYear(), finalEndDate.getMonth(), 0);
        }
        else if(viewType === 'Year') {
            finalStartDate = new Date(finalStartDate.getFullYear() - 1, 0, 1);
            finalEndDate = new Date(finalEndDate.getFullYear() - 1, 11, 31);
        }
        else {
            finalStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
            finalEndDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
        }

        periodObj.startDate = TimeUtils.getIST(finalStartDate);
        periodObj.endDate = TimeUtils.getIST(finalEndDate);
    }
}

module.exports = GeneralUtils;