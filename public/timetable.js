const timetable = {
    getDay: function(dayName) {
        return this.days.find(function(day, index) {
            if(day.name == dayName) {
                return true;
            } 
        });
    },
    getToday: function() {

        const d = new Date();
        const weekday = new Array(7);
        weekday[0] = "sunday";
        weekday[1] = "monday";
        weekday[2] = "tuesday";
        weekday[3] = "wednesday";
        weekday[4] = "thursday";
        weekday[5] = "friday";
        weekday[6] = "saturday";

        return this.getDay(weekday[d.getDay()]);
    },
    getSportNow: function() {
        const d = new Date();//"November 26, 2021 18:15:00"

        if(d.getDay() == 6) {
            return {
                flag: false,
                message: 'No sports on Saturday'
            };
        }

        let dayObj = {};

        const weekday = new Array(7);
        weekday[0] = "sunday";
        weekday[1] = "monday";
        weekday[2] = "tuesday";
        weekday[3] = "wednesday";
        weekday[4] = "thursday";
        weekday[5] = "friday";
        weekday[6] = "saturday";

        const dayNow = weekday[d.getDay()];
        const hourNow = d.getHours();
        const minuteNow = d.getMinutes();

        //console.log('REs: ' + d.getDate());
        
        const foundDay = this.days.find(function(day, index) {
            if(day.name == dayNow) {
                return true;
            } 
        });

        const sportFound = foundDay.sports.find(function(s, index) {
            if(s.start_hour <= hourNow && s.end_hour >= hourNow && s.start_minute <= minuteNow && s.end_minute >= minuteNow) {
                return true;
            }
        });

        if(typeof sportFound === 'undefined') {
            //console.log('NO sports now');
            return {
                flag: false,
                message: 'No sport is taking place now. We are closed.'
            };
        }

        //console.log('Title: ' + sportFound.title);

        dayObj.weekday = dayNow;
        dayObj.sport = sportFound.title;
        dayObj.date = d;

        return {
            flag: true,
            sport: sportFound.title,
            message: `The ${sportFound.title} is taking place now.`,
            dayInfo: dayObj
        };
    },
    days: [
        {
            name: "monday",
            sports: [
                {
                    title: "Climbing",
                    start_hour: 16,
                    start_minute: 0,
                    end_hour: 17,
                    end_minute: 59
                },
                {
                    title: "Badminton",
                    start_hour: 18,
                    start_minute: 0,
                    end_hour: 19,
                    end_minute: 59
                }
            ]
        },
        {
            name: "tuesday",
            sports: [
                {
                    title: "Volleyball",
                    start_hour: 18,
                    start_minute: 0,
                    end_hour: 19,
                    end_minute: 59
                },
                {
                    title: "Football",
                    start_hour: 20,
                    start_minute: 0,
                    end_hour: 22,
                    end_minute: 0
                }
            ]
        },
        {
            name: "wednesday",
            sports: [
                {
                    title: "Boxing",
                    start_hour: 16,
                    start_minute: 0,
                    end_hour: 17,
                    end_minute: 59
                },
                {
                    title: "Basketball",
                    start_hour: 18,
                    start_minute: 0,
                    end_hour: 19,
                    end_minute: 59
                }
            ]
        },
        {
            name: "thursday",
            sports: [
                {
                    title: "Climbing",
                    start_hour: 16,
                    start_minute: 0,
                    end_hour: 17,
                    end_minute: 59
                },
                {
                    title: "Badminton",
                    start_hour: 18,
                    start_minute: 0,
                    end_hour: 19,
                    end_minute: 59
                },
                {
                    title: "Football",
                    start_hour: 20,
                    start_minute: 0,
                    end_hour: 22,
                    end_minute: 0
                }
            ]
        },
        {
            name: "friday",
            sports: [
                {
                    title: "Volleyball-(Onlyfans)",
                    start_hour: 16,
                    start_minute: 0,
                    end_hour: 17,
                    end_minute: 59
                },
                {
                    title: "Volleyball",
                    start_hour: 18,
                    start_minute: 0,
                    end_hour: 19,
                    end_minute: 59
                }
            ]
        },
        {
            name: "sunday",
            sports: [
                {
                    title: "Badminton",
                    start_hour: 16,
                    start_minute: 0,
                    end_hour: 17,
                    end_minute: 59
                },
                {
                    title: "Volleyball",
                    start_hour: 18,
                    start_minute: 0,
                    end_hour: 19,
                    end_minute: 59
                }
            ]
        }
    ]
};

module.exports = timetable;