class TimeUtils {
    static getIST(date) {
        let finalDate = new Date();
        if(date)
            finalDate = new Date(date);
        const ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes 
        const offset = ISToffSet * 60 * 1000;
        const ISTTime = new Date(finalDate.getTime() + offset);
        return ISTTime;
    }

    static getTimeDifferenceInMin(bookingDate,currDate){

       const currentDate = this.getIST(currDate);
       const diff = Math.abs(bookingDate - new Date(currentDate));
        const diffInMinutes = Math.floor((diff/1000)/60);
        return diffInMinutes;
    }
}

module.exports = TimeUtils;