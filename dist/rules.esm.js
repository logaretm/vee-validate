/**
  * vee-validate v2.0.7
  * (c) 2018 Abdelrahman Awad
  * @license MIT
  */
var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var DEFAULT_ADDITIONAL_DIGITS = 2;
var patterns = {
    dateTimeDelimeter: /[T ]/,
    plainTime: /:/,
    YY: /^(\d{2})$/,
    YYY: [/^([+-]\d{2})$/,/^([+-]\d{3})$/,/^([+-]\d{4})$/],
    YYYY: /^(\d{4})/,
    YYYYY: [/^([+-]\d{4})/,/^([+-]\d{5})/,/^([+-]\d{6})/],
    MM: /^-(\d{2})$/,
    DDD: /^-?(\d{3})$/,
    MMDD: /^-?(\d{2})-?(\d{2})$/,
    Www: /^-?W(\d{2})$/,
    WwwD: /^-?W(\d{2})-?(\d{1})$/,
    HH: /^(\d{2}([.,]\d*)?)$/,
    HHMM: /^(\d{2}):?(\d{2}([.,]\d*)?)$/,
    HHMMSS: /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/,
    timezone: /([Z+-].*)$/,
    timezoneZ: /^(Z)$/,
    timezoneHH: /^([+-])(\d{2})$/,
    timezoneHHMM: /^([+-])(\d{2}):?(\d{2})$/
};
function toDate(argument, dirtyOptions) {
    if (arguments.length < 1) {
        throw new TypeError('1 argument required, but only ' + arguments.length + ' present');
    }
    if (argument === null) {
        return new Date(NaN);
    }
    var options = dirtyOptions || {};
    var additionalDigits = options.additionalDigits === undefined ? DEFAULT_ADDITIONAL_DIGITS : Number(options.additionalDigits);
    if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
        throw new RangeError('additionalDigits must be 0, 1 or 2');
    }
    if (argument instanceof Date) {
        return new Date(argument.getTime());
    } else if (typeof argument !== 'string') {
        return new Date(argument);
    }
    var dateStrings = splitDateString(argument);
    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    var year = parseYearResult.year;
    var restDateString = parseYearResult.restDateString;
    var date = parseDate(restDateString, year);
    if (date) {
        var timestamp = date.getTime();
        var time = 0;
        var offset;
        if (dateStrings.time) {
            time = parseTime(dateStrings.time);
        }
        if (dateStrings.timezone) {
            offset = parseTimezone(dateStrings.timezone);
        } else {
            offset = new Date(timestamp + time).getTimezoneOffset();
            offset = new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE).getTimezoneOffset();
        }
        return new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE);
    } else {
        return new Date(argument);
    }
}

function splitDateString(dateString) {
    var dateStrings = {};
    var array = dateString.split(patterns.dateTimeDelimeter);
    var timeString;
    if (patterns.plainTime.test(array[0])) {
        dateStrings.date = null;
        timeString = array[0];
    } else {
        dateStrings.date = array[0];
        timeString = array[1];
    }
    if (timeString) {
        var token = patterns.timezone.exec(timeString);
        if (token) {
            dateStrings.time = timeString.replace(token[1], '');
            dateStrings.timezone = token[1];
        } else {
            dateStrings.time = timeString;
        }
    }
    return dateStrings;
}

function parseYear(dateString, additionalDigits) {
    var patternYYY = patterns.YYY[additionalDigits];
    var patternYYYYY = patterns.YYYYY[additionalDigits];
    var token;
    token = patterns.YYYY.exec(dateString) || patternYYYYY.exec(dateString);
    if (token) {
        var yearString = token[1];
        return {
            year: parseInt(yearString, 10),
            restDateString: dateString.slice(yearString.length)
        };
    }
    token = patterns.YY.exec(dateString) || patternYYY.exec(dateString);
    if (token) {
        var centuryString = token[1];
        return {
            year: parseInt(centuryString, 10) * 100,
            restDateString: dateString.slice(centuryString.length)
        };
    }
    return {
        year: null
    };
}

function parseDate(dateString, year) {
    if (year === null) {
        return null;
    }
    var token;
    var date;
    var month;
    var week;
    if (dateString.length === 0) {
        date = new Date(0);
        date.setUTCFullYear(year);
        return date;
    }
    token = patterns.MM.exec(dateString);
    if (token) {
        date = new Date(0);
        month = parseInt(token[1], 10) - 1;
        date.setUTCFullYear(year, month);
        return date;
    }
    token = patterns.DDD.exec(dateString);
    if (token) {
        date = new Date(0);
        var dayOfYear = parseInt(token[1], 10);
        date.setUTCFullYear(year, 0, dayOfYear);
        return date;
    }
    token = patterns.MMDD.exec(dateString);
    if (token) {
        date = new Date(0);
        month = parseInt(token[1], 10) - 1;
        var day = parseInt(token[2], 10);
        date.setUTCFullYear(year, month, day);
        return date;
    }
    token = patterns.Www.exec(dateString);
    if (token) {
        week = parseInt(token[1], 10) - 1;
        return dayOfISOYear(year, week);
    }
    token = patterns.WwwD.exec(dateString);
    if (token) {
        week = parseInt(token[1], 10) - 1;
        var dayOfWeek = parseInt(token[2], 10) - 1;
        return dayOfISOYear(year, week, dayOfWeek);
    }
    return null;
}

function parseTime(timeString) {
    var token;
    var hours;
    var minutes;
    token = patterns.HH.exec(timeString);
    if (token) {
        hours = parseFloat(token[1].replace(',', '.'));
        return hours % 24 * MILLISECONDS_IN_HOUR;
    }
    token = patterns.HHMM.exec(timeString);
    if (token) {
        hours = parseInt(token[1], 10);
        minutes = parseFloat(token[2].replace(',', '.'));
        return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE;
    }
    token = patterns.HHMMSS.exec(timeString);
    if (token) {
        hours = parseInt(token[1], 10);
        minutes = parseInt(token[2], 10);
        var seconds = parseFloat(token[3].replace(',', '.'));
        return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE + seconds * 1000;
    }
    return null;
}

function parseTimezone(timezoneString) {
    var token;
    var absoluteOffset;
    token = patterns.timezoneZ.exec(timezoneString);
    if (token) {
        return 0;
    }
    token = patterns.timezoneHH.exec(timezoneString);
    if (token) {
        absoluteOffset = parseInt(token[2], 10) * 60;
        return token[1] === '+' ? -absoluteOffset : absoluteOffset;
    }
    token = patterns.timezoneHHMM.exec(timezoneString);
    if (token) {
        absoluteOffset = parseInt(token[2], 10) * 60 + parseInt(token[3], 10);
        return token[1] === '+' ? -absoluteOffset : absoluteOffset;
    }
    return 0;
}

function dayOfISOYear(isoYear, week, day) {
    week = week || 0;
    day = day || 0;
    var date = new Date(0);
    date.setUTCFullYear(isoYear, 0, 4);
    var fourthOfJanuaryDay = date.getUTCDay() || 7;
    var diff = week * 7 + day + 1 - fourthOfJanuaryDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
}

function addMilliseconds(dirtyDate, dirtyAmount, dirtyOptions) {
    if (arguments.length < 2) {
        throw new TypeError('2 arguments required, but only ' + arguments.length + ' present');
    }
    var timestamp = toDate(dirtyDate, dirtyOptions).getTime();
    var amount = Number(dirtyAmount);
    return new Date(timestamp + amount);
}

function cloneObject(dirtyObject) {
    dirtyObject = dirtyObject || {};
    var object = {};
    for (var property in dirtyObject) {
        if (dirtyObject.hasOwnProperty(property)) {
            object[property] = dirtyObject[property];
        }
    }
    return object;
}

var MILLISECONDS_IN_MINUTE$2 = 60000;
function addMinutes(dirtyDate, dirtyAmount, dirtyOptions) {
    if (arguments.length < 2) {
        throw new TypeError('2 arguments required, but only ' + arguments.length + ' present');
    }
    var amount = Number(dirtyAmount);
    return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE$2, dirtyOptions);
}

function isValid(dirtyDate, dirtyOptions) {
    if (arguments.length < 1) {
        throw new TypeError('1 argument required, but only ' + arguments.length + ' present');
    }
    var date = toDate(dirtyDate, dirtyOptions);
    return !isNaN(date);
}

var formatDistanceLocale = {
    lessThanXSeconds: {
        one: 'less than a second',
        other: 'less than {{count}} seconds'
    },
    xSeconds: {
        one: '1 second',
        other: '{{count}} seconds'
    },
    halfAMinute: 'half a minute',
    lessThanXMinutes: {
        one: 'less than a minute',
        other: 'less than {{count}} minutes'
    },
    xMinutes: {
        one: '1 minute',
        other: '{{count}} minutes'
    },
    aboutXHours: {
        one: 'about 1 hour',
        other: 'about {{count}} hours'
    },
    xHours: {
        one: '1 hour',
        other: '{{count}} hours'
    },
    xDays: {
        one: '1 day',
        other: '{{count}} days'
    },
    aboutXMonths: {
        one: 'about 1 month',
        other: 'about {{count}} months'
    },
    xMonths: {
        one: '1 month',
        other: '{{count}} months'
    },
    aboutXYears: {
        one: 'about 1 year',
        other: 'about {{count}} years'
    },
    xYears: {
        one: '1 year',
        other: '{{count}} years'
    },
    overXYears: {
        one: 'over 1 year',
        other: 'over {{count}} years'
    },
    almostXYears: {
        one: 'almost 1 year',
        other: 'almost {{count}} years'
    }
};
function formatDistance(token, count, options) {
    options = options || {};
    var result;
    if (typeof formatDistanceLocale[token] === 'string') {
        result = formatDistanceLocale[token];
    } else if (count === 1) {
        result = formatDistanceLocale[token].one;
    } else {
        result = formatDistanceLocale[token].other.replace('{{count}}', count);
    }
    if (options.addSuffix) {
        if (options.comparison > 0) {
            return 'in ' + result;
        } else {
            return result + ' ago';
        }
    }
    return result;
}

var tokensToBeShortedPattern = /MMMM|MM|DD|dddd/g;
function buildShortLongFormat(format) {
    return format.replace(tokensToBeShortedPattern, function (token) {
        return token.slice(1);
    });
}

function buildFormatLongFn(obj) {
    var formatLongLocale = {
        LTS: obj.LTS,
        LT: obj.LT,
        L: obj.L,
        LL: obj.LL,
        LLL: obj.LLL,
        LLLL: obj.LLLL,
        l: obj.l || buildShortLongFormat(obj.L),
        ll: obj.ll || buildShortLongFormat(obj.LL),
        lll: obj.lll || buildShortLongFormat(obj.LLL),
        llll: obj.llll || buildShortLongFormat(obj.LLLL)
    };
    return function (token) {
        return formatLongLocale[token];
    };
}

var formatLong = buildFormatLongFn({
    LT: 'h:mm aa',
    LTS: 'h:mm:ss aa',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D YYYY',
    LLL: 'MMMM D YYYY h:mm aa',
    LLLL: 'dddd, MMMM D YYYY h:mm aa'
});

var formatRelativeLocale = {
    lastWeek: '[last] dddd [at] LT',
    yesterday: '[yesterday at] LT',
    today: '[today at] LT',
    tomorrow: '[tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    other: 'L'
};
function formatRelative(token, date, baseDate, options) {
    return formatRelativeLocale[token];
}

function buildLocalizeFn(values, defaultType, indexCallback) {
    return function (dirtyIndex, dirtyOptions) {
        var options = dirtyOptions || {};
        var type = options.type ? String(options.type) : defaultType;
        var valuesArray = values[type] || values[defaultType];
        var index = indexCallback ? indexCallback(Number(dirtyIndex)) : Number(dirtyIndex);
        return valuesArray[index];
    };
}

function buildLocalizeArrayFn(values, defaultType) {
    return function (dirtyOptions) {
        var options = dirtyOptions || {};
        var type = options.type ? String(options.type) : defaultType;
        return values[type] || values[defaultType];
    };
}

var weekdayValues = {
    narrow: ['Su','Mo','Tu','We','Th','Fr','Sa'],
    short: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    long: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
};
var monthValues = {
    short: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    long: ['January','February','March','April','May','June','July','August','September',
        'October','November','December']
};
var timeOfDayValues = {
    uppercase: ['AM','PM'],
    lowercase: ['am','pm'],
    long: ['a.m.','p.m.']
};
function ordinalNumber(dirtyNumber, dirtyOptions) {
    var number = Number(dirtyNumber);
    var rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
        switch (rem100 % 10) {
            case 1:
                return number + 'st';
            case 2:
                return number + 'nd';
            case 3:
                return number + 'rd';
        }
    }
    return number + 'th';
}

var localize = {
    ordinalNumber: ordinalNumber,
    weekday: buildLocalizeFn(weekdayValues, 'long'),
    weekdays: buildLocalizeArrayFn(weekdayValues, 'long'),
    month: buildLocalizeFn(monthValues, 'long'),
    months: buildLocalizeArrayFn(monthValues, 'long'),
    timeOfDay: buildLocalizeFn(timeOfDayValues, 'long', function (hours) {
        return hours / 12 >= 1 ? 1 : 0;
    }),
    timesOfDay: buildLocalizeArrayFn(timeOfDayValues, 'long')
};

function buildMatchFn(patterns, defaultType) {
    return function (dirtyString, dirtyOptions) {
        var options = dirtyOptions || {};
        var type = options.type ? String(options.type) : defaultType;
        var pattern = patterns[type] || patterns[defaultType];
        var string = String(dirtyString);
        return string.match(pattern);
    };
}

function buildParseFn(patterns, defaultType) {
    return function (matchResult, dirtyOptions) {
        var options = dirtyOptions || {};
        var type = options.type ? String(options.type) : defaultType;
        var patternsArray = patterns[type] || patterns[defaultType];
        var string = matchResult[1];
        return patternsArray.findIndex(function (pattern) {
            return pattern.test(string);
        });
    };
}

function buildMatchPatternFn(pattern) {
    return function (dirtyString) {
        var string = String(dirtyString);
        return string.match(pattern);
    };
}

function parseDecimal(matchResult) {
    return parseInt(matchResult[1], 10);
}

var matchOrdinalNumbersPattern = /^(\d+)(th|st|nd|rd)?/i;
var matchWeekdaysPatterns = {
    narrow: /^(su|mo|tu|we|th|fr|sa)/i,
    short: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    long: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseWeekdayPatterns = {
    any: [/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]
};
var matchMonthsPatterns = {
    short: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    long: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
    any: [/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,
        /^n/i,/^d/i]
};
var matchTimesOfDayPatterns = {
    short: /^(am|pm)/i,
    long: /^([ap]\.?\s?m\.?)/i
};
var parseTimeOfDayPatterns = {
    any: [/^a/i,/^p/i]
};
var match = {
    ordinalNumbers: buildMatchPatternFn(matchOrdinalNumbersPattern),
    ordinalNumber: parseDecimal,
    weekdays: buildMatchFn(matchWeekdaysPatterns, 'long'),
    weekday: buildParseFn(parseWeekdayPatterns, 'any'),
    months: buildMatchFn(matchMonthsPatterns, 'long'),
    month: buildParseFn(parseMonthPatterns, 'any'),
    timesOfDay: buildMatchFn(matchTimesOfDayPatterns, 'long'),
    timeOfDay: buildParseFn(parseTimeOfDayPatterns, 'any')
};

var locale = {
    formatDistance: formatDistance,
    formatLong: formatLong,
    formatRelative: formatRelative,
    localize: localize,
    match: match,
    options: {
        weekStartsOn: 0,
        firstWeekContainsDate: 1
    }
};

var MILLISECONDS_IN_DAY$1 = 86400000;
function getUTCDayOfYear(dirtyDate, dirtyOptions) {
    var date = toDate(dirtyDate, dirtyOptions);
    var timestamp = date.getTime();
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
    var startOfYearTimestamp = date.getTime();
    var difference = timestamp - startOfYearTimestamp;
    return Math.floor(difference / MILLISECONDS_IN_DAY$1) + 1;
}

function startOfUTCISOWeek(dirtyDate, dirtyOptions) {
    var weekStartsOn = 1;
    var date = toDate(dirtyDate, dirtyOptions);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}

function getUTCISOWeekYear(dirtyDate, dirtyOptions) {
    var date = toDate(dirtyDate, dirtyOptions);
    var year = date.getUTCFullYear();
    var fourthOfJanuaryOfNextYear = new Date(0);
    fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear, dirtyOptions);
    var fourthOfJanuaryOfThisYear = new Date(0);
    fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear, dirtyOptions);
    if (date.getTime() >= startOfNextYear.getTime()) {
        return year + 1;
    } else if (date.getTime() >= startOfThisYear.getTime()) {
        return year;
    } else {
        return year - 1;
    }
}

function startOfUTCISOWeekYear(dirtyDate, dirtyOptions) {
    var year = getUTCISOWeekYear(dirtyDate, dirtyOptions);
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setUTCFullYear(year, 0, 4);
    fourthOfJanuary.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCISOWeek(fourthOfJanuary, dirtyOptions);
    return date;
}

var MILLISECONDS_IN_WEEK$2 = 604800000;
function getUTCISOWeek(dirtyDate, dirtyOptions) {
    var date = toDate(dirtyDate, dirtyOptions);
    var diff = startOfUTCISOWeek(date, dirtyOptions).getTime() - startOfUTCISOWeekYear(date, dirtyOptions).getTime();
    return Math.round(diff / MILLISECONDS_IN_WEEK$2) + 1;
}

var formatters = {
    'M': function (date) {
        return date.getUTCMonth() + 1;
    },
    'Mo': function (date, options) {
        var month = date.getUTCMonth() + 1;
        return options.locale.localize.ordinalNumber(month, {
            unit: 'month'
        });
    },
    'MM': function (date) {
        return addLeadingZeros(date.getUTCMonth() + 1, 2);
    },
    'MMM': function (date, options) {
        return options.locale.localize.month(date.getUTCMonth(), {
            type: 'short'
        });
    },
    'MMMM': function (date, options) {
        return options.locale.localize.month(date.getUTCMonth(), {
            type: 'long'
        });
    },
    'Q': function (date) {
        return Math.ceil((date.getUTCMonth() + 1) / 3);
    },
    'Qo': function (date, options) {
        var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
        return options.locale.localize.ordinalNumber(quarter, {
            unit: 'quarter'
        });
    },
    'D': function (date) {
        return date.getUTCDate();
    },
    'Do': function (date, options) {
        return options.locale.localize.ordinalNumber(date.getUTCDate(), {
            unit: 'dayOfMonth'
        });
    },
    'DD': function (date) {
        return addLeadingZeros(date.getUTCDate(), 2);
    },
    'DDD': function (date) {
        return getUTCDayOfYear(date);
    },
    'DDDo': function (date, options) {
        return options.locale.localize.ordinalNumber(getUTCDayOfYear(date), {
            unit: 'dayOfYear'
        });
    },
    'DDDD': function (date) {
        return addLeadingZeros(getUTCDayOfYear(date), 3);
    },
    'dd': function (date, options) {
        return options.locale.localize.weekday(date.getUTCDay(), {
            type: 'narrow'
        });
    },
    'ddd': function (date, options) {
        return options.locale.localize.weekday(date.getUTCDay(), {
            type: 'short'
        });
    },
    'dddd': function (date, options) {
        return options.locale.localize.weekday(date.getUTCDay(), {
            type: 'long'
        });
    },
    'd': function (date) {
        return date.getUTCDay();
    },
    'do': function (date, options) {
        return options.locale.localize.ordinalNumber(date.getUTCDay(), {
            unit: 'dayOfWeek'
        });
    },
    'E': function (date) {
        return date.getUTCDay() || 7;
    },
    'W': function (date) {
        return getUTCISOWeek(date);
    },
    'Wo': function (date, options) {
        return options.locale.localize.ordinalNumber(getUTCISOWeek(date), {
            unit: 'isoWeek'
        });
    },
    'WW': function (date) {
        return addLeadingZeros(getUTCISOWeek(date), 2);
    },
    'YY': function (date) {
        return addLeadingZeros(date.getUTCFullYear(), 4).substr(2);
    },
    'YYYY': function (date) {
        return addLeadingZeros(date.getUTCFullYear(), 4);
    },
    'GG': function (date) {
        return String(getUTCISOWeekYear(date)).substr(2);
    },
    'GGGG': function (date) {
        return getUTCISOWeekYear(date);
    },
    'H': function (date) {
        return date.getUTCHours();
    },
    'HH': function (date) {
        return addLeadingZeros(date.getUTCHours(), 2);
    },
    'h': function (date) {
        var hours = date.getUTCHours();
        if (hours === 0) {
            return 12;
        } else if (hours > 12) {
            return hours % 12;
        } else {
            return hours;
        }
    },
    'hh': function (date) {
        return addLeadingZeros(formatters['h'](date), 2);
    },
    'm': function (date) {
        return date.getUTCMinutes();
    },
    'mm': function (date) {
        return addLeadingZeros(date.getUTCMinutes(), 2);
    },
    's': function (date) {
        return date.getUTCSeconds();
    },
    'ss': function (date) {
        return addLeadingZeros(date.getUTCSeconds(), 2);
    },
    'S': function (date) {
        return Math.floor(date.getUTCMilliseconds() / 100);
    },
    'SS': function (date) {
        return addLeadingZeros(Math.floor(date.getUTCMilliseconds() / 10), 2);
    },
    'SSS': function (date) {
        return addLeadingZeros(date.getUTCMilliseconds(), 3);
    },
    'Z': function (date, options) {
        var originalDate = options._originalDate || date;
        return formatTimezone(originalDate.getTimezoneOffset(), ':');
    },
    'ZZ': function (date, options) {
        var originalDate = options._originalDate || date;
        return formatTimezone(originalDate.getTimezoneOffset());
    },
    'X': function (date, options) {
        var originalDate = options._originalDate || date;
        return Math.floor(originalDate.getTime() / 1000);
    },
    'x': function (date, options) {
        var originalDate = options._originalDate || date;
        return originalDate.getTime();
    },
    'A': function (date, options) {
        return options.locale.localize.timeOfDay(date.getUTCHours(), {
            type: 'uppercase'
        });
    },
    'a': function (date, options) {
        return options.locale.localize.timeOfDay(date.getUTCHours(), {
            type: 'lowercase'
        });
    },
    'aa': function (date, options) {
        return options.locale.localize.timeOfDay(date.getUTCHours(), {
            type: 'long'
        });
    }
};
function formatTimezone(offset, delimeter) {
    delimeter = delimeter || '';
    var sign = offset > 0 ? '-' : '+';
    var absOffset = Math.abs(offset);
    var hours = Math.floor(absOffset / 60);
    var minutes = absOffset % 60;
    return sign + addLeadingZeros(hours, 2) + delimeter + addLeadingZeros(minutes, 2);
}

function addLeadingZeros(number, targetLength) {
    var output = Math.abs(number).toString();
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

function addUTCMinutes(dirtyDate, dirtyAmount, dirtyOptions) {
    var date = toDate(dirtyDate, dirtyOptions);
    var amount = Number(dirtyAmount);
    date.setUTCMinutes(date.getUTCMinutes() + amount);
    return date;
}

var longFormattingTokensRegExp = /(\[[^[]*])|(\\)?(LTS|LT|LLLL|LLL|LL|L|llll|lll|ll|l)/g;
var defaultFormattingTokensRegExp = /(\[[^[]*])|(\\)?(x|ss|s|mm|m|hh|h|do|dddd|ddd|dd|d|aa|a|ZZ|Z|YYYY|YY|X|Wo|WW|W|SSS|SS|S|Qo|Q|Mo|MMMM|MMM|MM|M|HH|H|GGGG|GG|E|Do|DDDo|DDDD|DDD|DD|D|A|.)/g;
function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
    if (arguments.length < 2) {
        throw new TypeError('2 arguments required, but only ' + arguments.length + ' present');
    }
    var formatStr = String(dirtyFormatStr);
    var options = dirtyOptions || {};
    var locale$$1 = options.locale || locale;
    if (!locale$$1.localize) {
        throw new RangeError('locale must contain localize property');
    }
    if (!locale$$1.formatLong) {
        throw new RangeError('locale must contain formatLong property');
    }
    var localeFormatters = locale$$1.formatters || {};
    var formattingTokensRegExp = locale$$1.formattingTokensRegExp || defaultFormattingTokensRegExp;
    var formatLong = locale$$1.formatLong;
    var originalDate = toDate(dirtyDate, options);
    if (!isValid(originalDate, options)) {
        return 'Invalid Date';
    }
    var timezoneOffset = originalDate.getTimezoneOffset();
    var utcDate = addUTCMinutes(originalDate, -timezoneOffset, options);
    var formatterOptions = cloneObject(options);
    formatterOptions.locale = locale$$1;
    formatterOptions.formatters = formatters;
    formatterOptions._originalDate = originalDate;
    var result = formatStr.replace(longFormattingTokensRegExp, function (substring) {
        if (substring[0] === '[') {
            return substring;
        }
        if (substring[0] === '\\') {
            return cleanEscapedString(substring);
        }
        return formatLong(substring);
    }).replace(formattingTokensRegExp, function (substring) {
        var formatter = localeFormatters[substring] || formatters[substring];
        if (formatter) {
            return formatter(utcDate, formatterOptions);
        } else {
            return cleanEscapedString(substring);
        }
    });
    return result;
}

function cleanEscapedString(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function subMinutes(dirtyDate, dirtyAmount, dirtyOptions) {
    if (arguments.length < 2) {
        throw new TypeError('2 arguments required, but only ' + arguments.length + ' present');
    }
    var amount = Number(dirtyAmount);
    return addMinutes(dirtyDate, -amount, dirtyOptions);
}

function isAfter(dirtyDate, dirtyDateToCompare, dirtyOptions) {
    if (arguments.length < 2) {
        throw new TypeError('2 arguments required, but only ' + arguments.length + ' present');
    }
    var date = toDate(dirtyDate, dirtyOptions);
    var dateToCompare = toDate(dirtyDateToCompare, dirtyOptions);
    return date.getTime() > dateToCompare.getTime();
}

function isBefore(dirtyDate, dirtyDateToCompare, dirtyOptions) {
    if (arguments.length < 2) {
        throw new TypeError('2 arguments required, but only ' + arguments.length + ' present');
    }
    var date = toDate(dirtyDate, dirtyOptions);
    var dateToCompare = toDate(dirtyDateToCompare, dirtyOptions);
    return date.getTime() < dateToCompare.getTime();
}

function isEqual(dirtyLeftDate, dirtyRightDate, dirtyOptions) {
    if (arguments.length < 2) {
        throw new TypeError('2 arguments required, but only ' + arguments.length + ' present');
    }
    var dateLeft = toDate(dirtyLeftDate, dirtyOptions);
    var dateRight = toDate(dirtyRightDate, dirtyOptions);
    return dateLeft.getTime() === dateRight.getTime();
}

var patterns$1 = {
    'M': /^(1[0-2]|0?\d)/,
    'D': /^(3[0-1]|[0-2]?\d)/,
    'DDD': /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
    'W': /^(5[0-3]|[0-4]?\d)/,
    'YYYY': /^(\d{1,4})/,
    'H': /^(2[0-3]|[0-1]?\d)/,
    'm': /^([0-5]?\d)/,
    'Z': /^([+-])(\d{2}):(\d{2})/,
    'ZZ': /^([+-])(\d{2})(\d{2})/,
    singleDigit: /^(\d)/,
    twoDigits: /^(\d{2})/,
    threeDigits: /^(\d{3})/,
    fourDigits: /^(\d{4})/,
    anyDigits: /^(\d+)/
};
function parseDecimal$1(matchResult) {
    return parseInt(matchResult[1], 10);
}

var parsers = {
    'YY': {
        unit: 'twoDigitYear',
        match: patterns$1.twoDigits,
        parse: function (matchResult) {
            return parseDecimal$1(matchResult);
        }
    },
    'YYYY': {
        unit: 'year',
        match: patterns$1.YYYY,
        parse: parseDecimal$1
    },
    'GG': {
        unit: 'isoYear',
        match: patterns$1.twoDigits,
        parse: function (matchResult) {
            return parseDecimal$1(matchResult) + 1900;
        }
    },
    'GGGG': {
        unit: 'isoYear',
        match: patterns$1.YYYY,
        parse: parseDecimal$1
    },
    'Q': {
        unit: 'quarter',
        match: patterns$1.singleDigit,
        parse: parseDecimal$1
    },
    'Qo': {
        unit: 'quarter',
        match: function (string, options) {
            return options.locale.match.ordinalNumbers(string, {
                unit: 'quarter'
            });
        },
        parse: function (matchResult, options) {
            return options.locale.match.ordinalNumber(matchResult, {
                unit: 'quarter'
            });
        }
    },
    'M': {
        unit: 'month',
        match: patterns$1.M,
        parse: function (matchResult) {
            return parseDecimal$1(matchResult) - 1;
        }
    },
    'Mo': {
        unit: 'month',
        match: function (string, options) {
            return options.locale.match.ordinalNumbers(string, {
                unit: 'month'
            });
        },
        parse: function (matchResult, options) {
            return options.locale.match.ordinalNumber(matchResult, {
                unit: 'month'
            }) - 1;
        }
    },
    'MM': {
        unit: 'month',
        match: patterns$1.twoDigits,
        parse: function (matchResult) {
            return parseDecimal$1(matchResult) - 1;
        }
    },
    'MMM': {
        unit: 'month',
        match: function (string, options) {
            return options.locale.match.months(string, {
                type: 'short'
            });
        },
        parse: function (matchResult, options) {
            return options.locale.match.month(matchResult, {
                type: 'short'
            });
        }
    },
    'MMMM': {
        unit: 'month',
        match: function (string, options) {
            return options.locale.match.months(string, {
                type: 'long'
            }) || options.locale.match.months(string, {
                type: 'short'
            });
        },
        parse: function (matchResult, options) {
            var parseResult = options.locale.match.month(matchResult, {
                type: 'long'
            });
            if (parseResult == null) {
                parseResult = options.locale.match.month(matchResult, {
                    type: 'short'
                });
            }
            return parseResult;
        }
    },
    'W': {
        unit: 'isoWeek',
        match: patterns$1.W,
        parse: parseDecimal$1
    },
    'Wo': {
        unit: 'isoWeek',
        match: function (string, options) {
            return options.locale.match.ordinalNumbers(string, {
                unit: 'isoWeek'
            });
        },
        parse: function (matchResult, options) {
            return options.locale.match.ordinalNumber(matchResult, {
                unit: 'isoWeek'
            });
        }
    },
    'WW': {
        unit: 'isoWeek',
        match: patterns$1.twoDigits,
        parse: parseDecimal$1
    },
    'd': {
        unit: 'dayOfWeek',
        match: patterns$1.singleDigit,
        parse: parseDecimal$1
    },
    'do': {
        unit: 'dayOfWeek',
        match: function (string, options) {
            return options.locale.match.ordinalNumbers(string, {
                unit: 'dayOfWeek'
            });
        },
        parse: function (matchResult, options) {
            return options.locale.match.ordinalNumber(matchResult, {
                unit: 'dayOfWeek'
            });
        }
    },
    'dd': {
        unit: 'dayOfWeek',
        match: function (string, options) {
            return options.locale.match.weekdays(string, {
                type: 'narrow'
            });
        },
        parse: function (matchResult, options) {
            return options.locale.match.weekday(matchResult, {
                type: 'narrow'
            });
        }
    },
    'ddd': {
        unit: 'dayOfWeek',
        match: function (string, options) {
            return options.locale.match.weekdays(string, {
                type: 'short'
            }) || options.locale.match.weekdays(string, {
                type: 'narrow'
            });
        },
        parse: function (matchResult, options) {
            var parseResult = options.locale.match.weekday(matchResult, {
                type: 'short'
            });
            if (parseResult == null) {
                parseResult = options.locale.match.weekday(matchResult, {
                    type: 'narrow'
                });
            }
            return parseResult;
        }
    },
    'dddd': {
        unit: 'dayOfWeek',
        match: function (string, options) {
            return options.locale.match.weekdays(string, {
                type: 'long'
            }) || options.locale.match.weekdays(string, {
                type: 'short'
            }) || options.locale.match.weekdays(string, {
                type: 'narrow'
            });
        },
        parse: function (matchResult, options) {
            var parseResult = options.locale.match.weekday(matchResult, {
                type: 'long'
            });
            if (parseResult == null) {
                parseResult = options.locale.match.weekday(matchResult, {
                    type: 'short'
                });
                if (parseResult == null) {
                    parseResult = options.locale.match.weekday(matchResult, {
                        type: 'narrow'
                    });
                }
            }
            return parseResult;
        }
    },
    'E': {
        unit: 'dayOfISOWeek',
        match: patterns$1.singleDigit,
        parse: function (matchResult) {
            return parseDecimal$1(matchResult);
        }
    },
    'D': {
        unit: 'dayOfMonth',
        match: patterns$1.D,
        parse: parseDecimal$1
    },
    'Do': {
        unit: 'dayOfMonth',
        match: function (string, options) {
            return options.locale.match.ordinalNumbers(string, {
                unit: 'dayOfMonth'
            });
        },
        parse: function (matchResult, options) {
            return options.locale.match.ordinalNumber(matchResult, {
                unit: 'dayOfMonth'
            });
        }
    },
    'DD': {
        unit: 'dayOfMonth',
        match: patterns$1.twoDigits,
        parse: parseDecimal$1
    },
    'DDD': {
        unit: 'dayOfYear',
        match: patterns$1.DDD,
        parse: parseDecimal$1
    },
    'DDDo': {
        unit: 'dayOfYear',
        match: function (string, options) {
            return options.locale.match.ordinalNumbers(string, {
                unit: 'dayOfYear'
            });
        },
        parse: function (matchResult, options) {
            return options.locale.match.ordinalNumber(matchResult, {
                unit: 'dayOfYear'
            });
        }
    },
    'DDDD': {
        unit: 'dayOfYear',
        match: patterns$1.threeDigits,
        parse: parseDecimal$1
    },
    'A': {
        unit: 'timeOfDay',
        match: function (string, options) {
            return options.locale.match.timesOfDay(string, {
                type: 'short'
            });
        },
        parse: function (matchResult, options) {
            return options.locale.match.timeOfDay(matchResult, {
                type: 'short'
            });
        }
    },
    'aa': {
        unit: 'timeOfDay',
        match: function (string, options) {
            return options.locale.match.timesOfDay(string, {
                type: 'long'
            }) || options.locale.match.timesOfDay(string, {
                type: 'short'
            });
        },
        parse: function (matchResult, options) {
            var parseResult = options.locale.match.timeOfDay(matchResult, {
                type: 'long'
            });
            if (parseResult == null) {
                parseResult = options.locale.match.timeOfDay(matchResult, {
                    type: 'short'
                });
            }
            return parseResult;
        }
    },
    'H': {
        unit: 'hours',
        match: patterns$1.H,
        parse: parseDecimal$1
    },
    'HH': {
        unit: 'hours',
        match: patterns$1.twoDigits,
        parse: parseDecimal$1
    },
    'h': {
        unit: 'timeOfDayHours',
        match: patterns$1.M,
        parse: parseDecimal$1
    },
    'hh': {
        unit: 'timeOfDayHours',
        match: patterns$1.twoDigits,
        parse: parseDecimal$1
    },
    'm': {
        unit: 'minutes',
        match: patterns$1.m,
        parse: parseDecimal$1
    },
    'mm': {
        unit: 'minutes',
        match: patterns$1.twoDigits,
        parse: parseDecimal$1
    },
    's': {
        unit: 'seconds',
        match: patterns$1.m,
        parse: parseDecimal$1
    },
    'ss': {
        unit: 'seconds',
        match: patterns$1.twoDigits,
        parse: parseDecimal$1
    },
    'S': {
        unit: 'milliseconds',
        match: patterns$1.singleDigit,
        parse: function (matchResult) {
            return parseDecimal$1(matchResult) * 100;
        }
    },
    'SS': {
        unit: 'milliseconds',
        match: patterns$1.twoDigits,
        parse: function (matchResult) {
            return parseDecimal$1(matchResult) * 10;
        }
    },
    'SSS': {
        unit: 'milliseconds',
        match: patterns$1.threeDigits,
        parse: parseDecimal$1
    },
    'Z': {
        unit: 'timezone',
        match: patterns$1.Z,
        parse: function (matchResult) {
            var sign = matchResult[1];
            var hours = parseInt(matchResult[2], 10);
            var minutes = parseInt(matchResult[3], 10);
            var absoluteOffset = hours * 60 + minutes;
            return sign === '+' ? absoluteOffset : -absoluteOffset;
        }
    },
    'ZZ': {
        unit: 'timezone',
        match: patterns$1.ZZ,
        parse: function (matchResult) {
            var sign = matchResult[1];
            var hours = parseInt(matchResult[2], 10);
            var minutes = parseInt(matchResult[3], 10);
            var absoluteOffset = hours * 60 + minutes;
            return sign === '+' ? absoluteOffset : -absoluteOffset;
        }
    },
    'X': {
        unit: 'timestamp',
        match: patterns$1.anyDigits,
        parse: function (matchResult) {
            return parseDecimal$1(matchResult) * 1000;
        }
    },
    'x': {
        unit: 'timestamp',
        match: patterns$1.anyDigits,
        parse: parseDecimal$1
    }
};
parsers['a'] = parsers['A'];

function setUTCDay(dirtyDate, dirtyDay, dirtyOptions) {
    var options = dirtyOptions || {};
    var locale = options.locale;
    var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
    var defaultWeekStartsOn = localeWeekStartsOn === undefined ? 0 : Number(localeWeekStartsOn);
    var weekStartsOn = options.weekStartsOn === undefined ? defaultWeekStartsOn : Number(options.weekStartsOn);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
        throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
    }
    var date = toDate(dirtyDate, dirtyOptions);
    var day = Number(dirtyDay);
    var currentDay = date.getUTCDay();
    var remainder = day % 7;
    var dayIndex = (remainder + 7) % 7;
    var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
}

function setUTCISODay(dirtyDate, dirtyDay, dirtyOptions) {
    var day = Number(dirtyDay);
    if (day % 7 === 0) {
        day = day - 7;
    }
    var weekStartsOn = 1;
    var date = toDate(dirtyDate, dirtyOptions);
    var currentDay = date.getUTCDay();
    var remainder = day % 7;
    var dayIndex = (remainder + 7) % 7;
    var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
}

function setUTCISOWeek(dirtyDate, dirtyISOWeek, dirtyOptions) {
    var date = toDate(dirtyDate, dirtyOptions);
    var isoWeek = Number(dirtyISOWeek);
    var diff = getUTCISOWeek(date, dirtyOptions) - isoWeek;
    date.setUTCDate(date.getUTCDate() - diff * 7);
    return date;
}

var MILLISECONDS_IN_DAY$3 = 86400000;
function setUTCISOWeekYear(dirtyDate, dirtyISOYear, dirtyOptions) {
    var date = toDate(dirtyDate, dirtyOptions);
    var isoYear = Number(dirtyISOYear);
    var dateStartOfYear = startOfUTCISOWeekYear(date, dirtyOptions);
    var diff = Math.floor((date.getTime() - dateStartOfYear.getTime()) / MILLISECONDS_IN_DAY$3);
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setUTCFullYear(isoYear, 0, 4);
    fourthOfJanuary.setUTCHours(0, 0, 0, 0);
    date = startOfUTCISOWeekYear(fourthOfJanuary, dirtyOptions);
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
}

var MILLISECONDS_IN_MINUTE$6 = 60000;
function setTimeOfDay(hours, timeOfDay) {
    var isAM = timeOfDay === 0;
    if (isAM) {
        if (hours === 12) {
            return 0;
        }
    } else {
        if (hours !== 12) {
            return 12 + hours;
        }
    }
    return hours;
}

var units = {
    twoDigitYear: {
        priority: 10,
        set: function (dateValues, value) {
            var century = Math.floor(dateValues.date.getUTCFullYear() / 100);
            var year = century * 100 + value;
            dateValues.date.setUTCFullYear(year, 0, 1);
            dateValues.date.setUTCHours(0, 0, 0, 0);
            return dateValues;
        }
    },
    year: {
        priority: 10,
        set: function (dateValues, value) {
            dateValues.date.setUTCFullYear(value, 0, 1);
            dateValues.date.setUTCHours(0, 0, 0, 0);
            return dateValues;
        }
    },
    isoYear: {
        priority: 10,
        set: function (dateValues, value, options) {
            dateValues.date = startOfUTCISOWeekYear(setUTCISOWeekYear(dateValues.date, value, options), options);
            return dateValues;
        }
    },
    quarter: {
        priority: 20,
        set: function (dateValues, value) {
            dateValues.date.setUTCMonth((value - 1) * 3, 1);
            dateValues.date.setUTCHours(0, 0, 0, 0);
            return dateValues;
        }
    },
    month: {
        priority: 30,
        set: function (dateValues, value) {
            dateValues.date.setUTCMonth(value, 1);
            dateValues.date.setUTCHours(0, 0, 0, 0);
            return dateValues;
        }
    },
    isoWeek: {
        priority: 40,
        set: function (dateValues, value, options) {
            dateValues.date = startOfUTCISOWeek(setUTCISOWeek(dateValues.date, value, options), options);
            return dateValues;
        }
    },
    dayOfWeek: {
        priority: 50,
        set: function (dateValues, value, options) {
            dateValues.date = setUTCDay(dateValues.date, value, options);
            dateValues.date.setUTCHours(0, 0, 0, 0);
            return dateValues;
        }
    },
    dayOfISOWeek: {
        priority: 50,
        set: function (dateValues, value, options) {
            dateValues.date = setUTCISODay(dateValues.date, value, options);
            dateValues.date.setUTCHours(0, 0, 0, 0);
            return dateValues;
        }
    },
    dayOfMonth: {
        priority: 50,
        set: function (dateValues, value) {
            dateValues.date.setUTCDate(value);
            dateValues.date.setUTCHours(0, 0, 0, 0);
            return dateValues;
        }
    },
    dayOfYear: {
        priority: 50,
        set: function (dateValues, value) {
            dateValues.date.setUTCMonth(0, value);
            dateValues.date.setUTCHours(0, 0, 0, 0);
            return dateValues;
        }
    },
    timeOfDay: {
        priority: 60,
        set: function (dateValues, value, options) {
            dateValues.timeOfDay = value;
            return dateValues;
        }
    },
    hours: {
        priority: 70,
        set: function (dateValues, value, options) {
            dateValues.date.setUTCHours(value, 0, 0, 0);
            return dateValues;
        }
    },
    timeOfDayHours: {
        priority: 70,
        set: function (dateValues, value, options) {
            var timeOfDay = dateValues.timeOfDay;
            if (timeOfDay != null) {
                value = setTimeOfDay(value, timeOfDay);
            }
            dateValues.date.setUTCHours(value, 0, 0, 0);
            return dateValues;
        }
    },
    minutes: {
        priority: 80,
        set: function (dateValues, value) {
            dateValues.date.setUTCMinutes(value, 0, 0);
            return dateValues;
        }
    },
    seconds: {
        priority: 90,
        set: function (dateValues, value) {
            dateValues.date.setUTCSeconds(value, 0);
            return dateValues;
        }
    },
    milliseconds: {
        priority: 100,
        set: function (dateValues, value) {
            dateValues.date.setUTCMilliseconds(value);
            return dateValues;
        }
    },
    timezone: {
        priority: 110,
        set: function (dateValues, value) {
            dateValues.date = new Date(dateValues.date.getTime() - value * MILLISECONDS_IN_MINUTE$6);
            return dateValues;
        }
    },
    timestamp: {
        priority: 120,
        set: function (dateValues, value) {
            dateValues.date = new Date(value);
            return dateValues;
        }
    }
};

var TIMEZONE_UNIT_PRIORITY = 110;
var MILLISECONDS_IN_MINUTE$7 = 60000;
var longFormattingTokensRegExp$1 = /(\[[^[]*])|(\\)?(LTS|LT|LLLL|LLL|LL|L|llll|lll|ll|l)/g;
var defaultParsingTokensRegExp = /(\[[^[]*])|(\\)?(x|ss|s|mm|m|hh|h|do|dddd|ddd|dd|d|aa|a|ZZ|Z|YYYY|YY|X|Wo|WW|W|SSS|SS|S|Qo|Q|Mo|MMMM|MMM|MM|M|HH|H|GGGG|GG|E|Do|DDDo|DDDD|DDD|DD|D|A|.)/g;
function parse(dirtyDateString, dirtyFormatString, dirtyBaseDate, dirtyOptions) {
    if (arguments.length < 3) {
        throw new TypeError('3 arguments required, but only ' + arguments.length + ' present');
    }
    var dateString = String(dirtyDateString);
    var options = dirtyOptions || {};
    var weekStartsOn = options.weekStartsOn === undefined ? 0 : Number(options.weekStartsOn);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
        throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
    }
    var locale$$1 = options.locale || locale;
    var localeParsers = locale$$1.parsers || {};
    var localeUnits = locale$$1.units || {};
    if (!locale$$1.match) {
        throw new RangeError('locale must contain match property');
    }
    if (!locale$$1.formatLong) {
        throw new RangeError('locale must contain formatLong property');
    }
    var formatString = String(dirtyFormatString).replace(longFormattingTokensRegExp$1, function (substring) {
        if (substring[0] === '[') {
            return substring;
        }
        if (substring[0] === '\\') {
            return cleanEscapedString$1(substring);
        }
        return locale$$1.formatLong(substring);
    });
    if (formatString === '') {
        if (dateString === '') {
            return toDate(dirtyBaseDate, options);
        } else {
            return new Date(NaN);
        }
    }
    var subFnOptions = cloneObject(options);
    subFnOptions.locale = locale$$1;
    var tokens = formatString.match(locale$$1.parsingTokensRegExp || defaultParsingTokensRegExp);
    var tokensLength = tokens.length;
    var setters = [{
        priority: TIMEZONE_UNIT_PRIORITY,
        set: dateToSystemTimezone,
        index: 0
    }];
    var i;
    for (i = 0; i < tokensLength; i++) {
        var token = tokens[i];
        var parser = localeParsers[token] || parsers[token];
        if (parser) {
            var matchResult;
            if (parser.match instanceof RegExp) {
                matchResult = parser.match.exec(dateString);
            } else {
                matchResult = parser.match(dateString, subFnOptions);
            }
            if (!matchResult) {
                return new Date(NaN);
            }
            var unitName = parser.unit;
            var unit = localeUnits[unitName] || units[unitName];
            setters.push({
                priority: unit.priority,
                set: unit.set,
                value: parser.parse(matchResult, subFnOptions),
                index: setters.length
            });
            var substring = matchResult[0];
            dateString = dateString.slice(substring.length);
        } else {
            var head = tokens[i].match(/^\[.*]$/) ? tokens[i].replace(/^\[|]$/g, '') : tokens[i];
            if (dateString.indexOf(head) === 0) {
                dateString = dateString.slice(head.length);
            } else {
                return new Date(NaN);
            }
        }
    }
    var uniquePrioritySetters = setters.map(function (setter) {
        return setter.priority;
    }).sort(function (a, b) {
        return a - b;
    }).filter(function (priority, index, array) {
        return array.indexOf(priority) === index;
    }).map(function (priority) {
        return setters.filter(function (setter) {
            return setter.priority === priority;
        }).reverse();
    }).map(function (setterArray) {
        return setterArray[0];
    });
    var date = toDate(dirtyBaseDate, options);
    if (isNaN(date)) {
        return new Date(NaN);
    }
    var utcDate = subMinutes(date, date.getTimezoneOffset());
    var dateValues = {
        date: utcDate
    };
    var settersLength = uniquePrioritySetters.length;
    for (i = 0; i < settersLength; i++) {
        var setter = uniquePrioritySetters[i];
        dateValues = setter.set(dateValues, setter.value, subFnOptions);
    }
    return dateValues.date;
}

function dateToSystemTimezone(dateValues) {
    var date = dateValues.date;
    var time = date.getTime();
    var offset = date.getTimezoneOffset();
    offset = new Date(time + offset * MILLISECONDS_IN_MINUTE$7).getTimezoneOffset();
    dateValues.date = new Date(time + offset * MILLISECONDS_IN_MINUTE$7);
    return dateValues;
}

function cleanEscapedString$1(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function parseDate$1(date, format$$1) {
    if (typeof date !== 'string') {
        return isValid(date) ? date : null;
    }
    var parsed = parse(date, format$$1, new Date());
    if (!isValid(parsed) || format(parsed, format$$1) !== date) {
        return null;
    }
    return parsed;
}

function after (value, ref) {
    var otherValue = ref[0];
    var inclusion = ref[1];
    var format$$1 = ref[2];

    if (typeof format$$1 === 'undefined') {
        format$$1 = inclusion;
        inclusion = false;
    }
    value = parseDate$1(value, format$$1);
    otherValue = parseDate$1(otherValue, format$$1);
    if (!value || !otherValue) {
        return false;
    }
    return isAfter(value, otherValue) || inclusion && isEqual(value, otherValue);
}

var alpha = {
    en: /^[A-Z]*$/i,
    cs: /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*$/i,
    da: /^[A-ZÆØÅ]*$/i,
    de: /^[A-ZÄÖÜß]*$/i,
    es: /^[A-ZÁÉÍÑÓÚÜ]*$/i,
    fr: /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]*$/i,
    lt: /^[A-ZĄČĘĖĮŠŲŪŽ]*$/i,
    nl: /^[A-ZÉËÏÓÖÜ]*$/i,
    hu: /^[A-ZÁÉÍÓÖŐÚÜŰ]*$/i,
    pl: /^[A-ZĄĆĘŚŁŃÓŻŹ]*$/i,
    pt: /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]*$/i,
    ru: /^[А-ЯЁ]*$/i,
    sk: /^[A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ]*$/i,
    sr: /^[A-ZČĆŽŠĐ]*$/i,
    tr: /^[A-ZÇĞİıÖŞÜ]*$/i,
    uk: /^[А-ЩЬЮЯЄІЇҐ]*$/i,
    ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/
};
var alphaSpaces = {
    en: /^[A-Z\s]*$/i,
    cs: /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s]*$/i,
    da: /^[A-ZÆØÅ\s]*$/i,
    de: /^[A-ZÄÖÜß\s]*$/i,
    es: /^[A-ZÁÉÍÑÓÚÜ\s]*$/i,
    fr: /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ\s]*$/i,
    lt: /^[A-ZĄČĘĖĮŠŲŪŽ\s]*$/i,
    nl: /^[A-ZÉËÏÓÖÜ\s]*$/i,
    hu: /^[A-ZÁÉÍÓÖŐÚÜŰ\s]*$/i,
    pl: /^[A-ZĄĆĘŚŁŃÓŻŹ\s]*$/i,
    pt: /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ\s]*$/i,
    ru: /^[А-ЯЁ\s]*$/i,
    sk: /^[A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ\s]*$/i,
    sr: /^[A-ZČĆŽŠĐ\s]*$/i,
    tr: /^[A-ZÇĞİıÖŞÜ\s]*$/i,
    uk: /^[А-ЩЬЮЯЄІЇҐ\s]*$/i,
    ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ\s]*$/
};
var alphanumeric = {
    en: /^[0-9A-Z]*$/i,
    cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*$/i,
    da: /^[0-9A-ZÆØÅ]$/i,
    de: /^[0-9A-ZÄÖÜß]*$/i,
    es: /^[0-9A-ZÁÉÍÑÓÚÜ]*$/i,
    fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]*$/i,
    lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ]*$/i,
    hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]*$/i,
    nl: /^[0-9A-ZÉËÏÓÖÜ]*$/i,
    pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]*$/i,
    pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]*$/i,
    ru: /^[0-9А-ЯЁ]*$/i,
    sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ]*$/i,
    sr: /^[0-9A-ZČĆŽŠĐ]*$/i,
    tr: /^[0-9A-ZÇĞİıÖŞÜ]*$/i,
    uk: /^[0-9А-ЩЬЮЯЄІЇҐ]*$/i,
    ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/
};
var alphaDash = {
    en: /^[0-9A-Z_-]*$/i,
    cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ_-]*$/i,
    da: /^[0-9A-ZÆØÅ_-]*$/i,
    de: /^[0-9A-ZÄÖÜß_-]*$/i,
    es: /^[0-9A-ZÁÉÍÑÓÚÜ_-]*$/i,
    fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ_-]*$/i,
    lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ_-]*$/i,
    nl: /^[0-9A-ZÉËÏÓÖÜ_-]*$/i,
    hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ_-]*$/i,
    pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ_-]*$/i,
    pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ_-]*$/i,
    ru: /^[0-9А-ЯЁ_-]*$/i,
    sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ_-]*$/i,
    sr: /^[0-9A-ZČĆŽŠĐ_-]*$/i,
    tr: /^[0-9A-ZÇĞİıÖŞÜ_-]*$/i,
    uk: /^[0-9А-ЩЬЮЯЄІЇҐ_-]*$/i,
    ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ_-]*$/
};

var validate = function (value, ref) {
    if ( ref === void 0 ) ref = [];
    var locale = ref[0]; if ( locale === void 0 ) locale = null;

    if (Array.isArray(value)) {
        return value.every(function (val) { return validate(val, [locale]); });
    }
    if (!locale) {
        return Object.keys(alpha).some(function (loc) { return alpha[loc].test(value); });
    }
    return (alpha[locale] || alpha.en).test(value);
};

var validate$1 = function (value, ref) {
    if ( ref === void 0 ) ref = [];
    var locale = ref[0]; if ( locale === void 0 ) locale = null;

    if (Array.isArray(value)) {
        return value.every(function (val) { return validate$1(val, [locale]); });
    }
    if (!locale) {
        return Object.keys(alphaDash).some(function (loc) { return alphaDash[loc].test(value); });
    }
    return (alphaDash[locale] || alphaDash.en).test(value);
};

var validate$2 = function (value, ref) {
    if ( ref === void 0 ) ref = [];
    var locale = ref[0]; if ( locale === void 0 ) locale = null;

    if (Array.isArray(value)) {
        return value.every(function (val) { return validate$2(val, [locale]); });
    }
    if (!locale) {
        return Object.keys(alphanumeric).some(function (loc) { return alphanumeric[loc].test(value); });
    }
    return (alphanumeric[locale] || alphanumeric.en).test(value);
};

var validate$3 = function (value, ref) {
    if ( ref === void 0 ) ref = [];
    var locale = ref[0]; if ( locale === void 0 ) locale = null;

    if (Array.isArray(value)) {
        return value.every(function (val) { return validate$3(val, [locale]); });
    }
    if (!locale) {
        return Object.keys(alphaSpaces).some(function (loc) { return alphaSpaces[loc].test(value); });
    }
    return (alphaSpaces[locale] || alphaSpaces.en).test(value);
};

function before (value, ref) {
    var otherValue = ref[0];
    var inclusion = ref[1];
    var format$$1 = ref[2];

    if (typeof format$$1 === 'undefined') {
        format$$1 = inclusion;
        inclusion = false;
    }
    value = parseDate$1(value, format$$1);
    otherValue = parseDate$1(otherValue, format$$1);
    if (!value || !otherValue) {
        return false;
    }
    return isBefore(value, otherValue) || inclusion && isEqual(value, otherValue);
}

var validate$4 = function (value, ref) {
    var min = ref[0];
    var max = ref[1];

    if (Array.isArray(value)) {
        return value.every(function (val) { return validate$4(val, [min,max]); });
    }
    return Number(min) <= value && Number(max) >= value;
};

function confirmed (value, other) { return String(value) === String(other); }

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var assertString_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = assertString;
    function assertString(input) {
        var isString = typeof input === 'string' || input instanceof String;
        if (!isString) {
            throw new TypeError('This library (validator.js) validates strings only');
        }
    }
    
    module.exports = exports['default'];
});
unwrapExports(assertString_1);

var isCreditCard_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = isCreditCard;
    var _assertString2 = _interopRequireDefault(assertString_1);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    
    var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/;
    function isCreditCard(str) {
        (0, _assertString2.default)(str);
        var sanitized = str.replace(/[- ]+/g, '');
        if (!creditCard.test(sanitized)) {
            return false;
        }
        var sum = 0;
        var digit = void 0;
        var tmpNum = void 0;
        var shouldDouble = void 0;
        for (var i = sanitized.length - 1;i >= 0; i--) {
            digit = sanitized.substring(i, i + 1);
            tmpNum = parseInt(digit, 10);
            if (shouldDouble) {
                tmpNum *= 2;
                if (tmpNum >= 10) {
                    sum += tmpNum % 10 + 1;
                } else {
                    sum += tmpNum;
                }
            } else {
                sum += tmpNum;
            }
            shouldDouble = !shouldDouble;
        }
        return !(!(sum % 10 === 0 ? sanitized : false));
    }
    
    module.exports = exports['default'];
});
var isCreditCard = unwrapExports(isCreditCard_1)

function credit_card (value) { return isCreditCard(String(value)); }

var validate$5 = function (value, ref) {
    if ( ref === void 0 ) ref = [];
    var decimals = ref[0]; if ( decimals === void 0 ) decimals = '*';
    var separator = ref[1]; if ( separator === void 0 ) separator = '.';

    if (Array.isArray(value)) {
        return value.every(function (val) { return validate$5(val, [decimals,separator]); });
    }
    if (value === null || value === undefined || value === '') {
        return true;
    }
    if (Number(decimals) === 0) {
        return /^-?\d*$/.test(value);
    }
    var regexPart = decimals === '*' ? '+' : ("{1," + decimals + "}");
    var regex = new RegExp(("^-?\\d*(\\" + separator + "\\d" + regexPart + ")?$"));
    if (!regex.test(value)) {
        return false;
    }
    var parsedValue = parseFloat(value);
    return parsedValue === parsedValue;
};

function date_between (value, params) {
    var assign, assign$1;

    var min$$1;
    var max$$1;
    var format$$1;
    var inclusivity = '()';
    if (params.length > 3) {
        (assign = params, min$$1 = assign[0], max$$1 = assign[1], inclusivity = assign[2], format$$1 = assign[3]);
    } else {
        (assign$1 = params, min$$1 = assign$1[0], max$$1 = assign$1[1], format$$1 = assign$1[2]);
    }
    var minDate = parseDate$1(String(min$$1), format$$1);
    var maxDate = parseDate$1(String(max$$1), format$$1);
    var dateVal = parseDate$1(String(value), format$$1);
    if (!minDate || !maxDate || !dateVal) {
        return false;
    }
    if (inclusivity === '()') {
        return isAfter(dateVal, minDate) && isBefore(dateVal, maxDate);
    }
    if (inclusivity === '(]') {
        return isAfter(dateVal, minDate) && (isEqual(dateVal, maxDate) || isBefore(dateVal, maxDate));
    }
    if (inclusivity === '[)') {
        return isBefore(dateVal, maxDate) && (isEqual(dateVal, minDate) || isAfter(dateVal, minDate));
    }
    return isEqual(dateVal, maxDate) || isEqual(dateVal, minDate) || isBefore(dateVal, maxDate) && isAfter(dateVal, minDate);
}

function date_format (value, ref) {
	var format = ref[0];

	return !(!parseDate$1(value, format));
}

var validate$6 = function (value, ref) {
    var length = ref[0];

    if (Array.isArray(value)) {
        return value.every(function (val) { return validate$6(val, [length]); });
    }
    var strVal = String(value);
    return /^[0-9]*$/.test(strVal) && strVal.length === Number(length);
};

var validateImage = function (file, width, height) {
    var URL = window.URL || window.webkitURL;
    return new Promise(function (resolve) {
        var image = new Image();
        image.onerror = (function () { return resolve({
            valid: false
        }); });
        image.onload = (function () { return resolve({
            valid: image.width === Number(width) && image.height === Number(height)
        }); });
        image.src = URL.createObjectURL(file);
    });
};
function dimensions (files, ref) {
    var width = ref[0];
    var height = ref[1];

    var list = [];
    for (var i = 0;i < files.length; i++) {
        if (!/\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
            return false;
        }
        list.push(files[i]);
    }
    return Promise.all(list.map(function (file) { return validateImage(file, width, height); }));
}

var merge_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = merge;
    function merge() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var defaults = arguments[1];
        for (var key in defaults) {
            if (typeof obj[key] === 'undefined') {
                obj[key] = defaults[key];
            }
        }
        return obj;
    }
    
    module.exports = exports['default'];
});
unwrapExports(merge_1);

var isByteLength_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.default = isByteLength;
    var _assertString2 = _interopRequireDefault(assertString_1);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    
    function isByteLength(str, options) {
        (0, _assertString2.default)(str);
        var min = void 0;
        var max = void 0;
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            min = options.min || 0;
            max = options.max;
        } else {
            min = arguments[1];
            max = arguments[2];
        }
        var len = encodeURI(str).split(/%..|./).length - 1;
        return len >= min && (typeof max === 'undefined' || len <= max);
    }
    
    module.exports = exports['default'];
});
unwrapExports(isByteLength_1);

var isFQDN_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = isFQDN;
    var _assertString2 = _interopRequireDefault(assertString_1);
    var _merge2 = _interopRequireDefault(merge_1);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    
    var default_fqdn_options = {
        require_tld: true,
        allow_underscores: false,
        allow_trailing_dot: false
    };
    function isFQDN(str, options) {
        (0, _assertString2.default)(str);
        options = (0, _merge2.default)(options, default_fqdn_options);
        if (options.allow_trailing_dot && str[str.length - 1] === '.') {
            str = str.substring(0, str.length - 1);
        }
        var parts = str.split('.');
        if (options.require_tld) {
            var tld = parts.pop();
            if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
                return false;
            }
            if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20]/.test(tld)) {
                return false;
            }
        }
        for (var part, i = 0;i < parts.length; i++) {
            part = parts[i];
            if (options.allow_underscores) {
                part = part.replace(/_/g, '');
            }
            if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
                return false;
            }
            if (/[\uff01-\uff5e]/.test(part)) {
                return false;
            }
            if (part[0] === '-' || part[part.length - 1] === '-') {
                return false;
            }
        }
        return true;
    }
    
    module.exports = exports['default'];
});
unwrapExports(isFQDN_1);

var isEmail_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = isEmail;
    var _assertString2 = _interopRequireDefault(assertString_1);
    var _merge2 = _interopRequireDefault(merge_1);
    var _isByteLength2 = _interopRequireDefault(isByteLength_1);
    var _isFQDN2 = _interopRequireDefault(isFQDN_1);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    
    var default_email_options = {
        allow_display_name: false,
        require_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true
    };
    var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\,\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
    var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
    var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
    var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
    var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
    function isEmail(str, options) {
        (0, _assertString2.default)(str);
        options = (0, _merge2.default)(options, default_email_options);
        if (options.require_display_name || options.allow_display_name) {
            var display_email = str.match(displayName);
            if (display_email) {
                str = display_email[1];
            } else if (options.require_display_name) {
                return false;
            }
        }
        var parts = str.split('@');
        var domain = parts.pop();
        var user = parts.join('@');
        var lower_domain = domain.toLowerCase();
        if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
            user = user.replace(/\./g, '').toLowerCase();
        }
        if (!(0, _isByteLength2.default)(user, {
            max: 64
        }) || !(0, _isByteLength2.default)(domain, {
            max: 254
        })) {
            return false;
        }
        if (!(0, _isFQDN2.default)(domain, {
            require_tld: options.require_tld
        })) {
            return false;
        }
        if (user[0] === '"') {
            user = user.slice(1, user.length - 1);
            return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
        }
        var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
        var user_parts = user.split('.');
        for (var i = 0;i < user_parts.length; i++) {
            if (!pattern.test(user_parts[i])) {
                return false;
            }
        }
        return true;
    }
    
    module.exports = exports['default'];
});
var isEmail = unwrapExports(isEmail_1)

var validate$7 = function (value) {
    if (Array.isArray(value)) {
        return value.every(function (val) { return isEmail(String(val)); });
    }
    return isEmail(String(value));
};

function ext (files, extensions) {
    var regex = new RegExp((".(" + (extensions.join('|')) + ")$"), 'i');
    return files.every(function (file) { return regex.test(file.name); });
}

function image (files) { return files.every(function (file) { return /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name); }); }

var validate$8 = function (value, options) {
    if (Array.isArray(value)) {
        return value.every(function (val) { return validate$8(val, options); });
    }
    return !(!options.filter(function (option) { return option == value; }).length);
};

var isIP_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = isIP;
    var _assertString2 = _interopRequireDefault(assertString_1);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    
    var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    var ipv6Block = /^[0-9A-F]{1,4}$/i;
    function isIP(str) {
        var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        (0, _assertString2.default)(str);
        version = String(version);
        if (!version) {
            return isIP(str, 4) || isIP(str, 6);
        } else if (version === '4') {
            if (!ipv4Maybe.test(str)) {
                return false;
            }
            var parts = str.split('.').sort(function (a, b) {
                return a - b;
            });
            return parts[3] <= 255;
        } else if (version === '6') {
            var blocks = str.split(':');
            var foundOmissionBlock = false;
            var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
            var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;
            if (blocks.length > expectedNumberOfBlocks) {
                return false;
            }
            if (str === '::') {
                return true;
            } else if (str.substr(0, 2) === '::') {
                blocks.shift();
                blocks.shift();
                foundOmissionBlock = true;
            } else if (str.substr(str.length - 2) === '::') {
                blocks.pop();
                blocks.pop();
                foundOmissionBlock = true;
            }
            for (var i = 0;i < blocks.length; ++i) {
                if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
                    if (foundOmissionBlock) {
                        return false;
                    }
                    foundOmissionBlock = true;
                } else if (foundIPv4TransitionBlock && i === blocks.length - 1) ; else if (!ipv6Block.test(blocks[i])) {
                    return false;
                }
            }
            if (foundOmissionBlock) {
                return blocks.length >= 1;
            }
            return blocks.length === expectedNumberOfBlocks;
        }
        return false;
    }
    
    module.exports = exports['default'];
});
var isIP = unwrapExports(isIP_1)

var isNullOrUndefined = function (value) { return value === null || value === undefined; };
var isCallable = function (func) { return typeof func === 'function'; };
var toArray = function (arrayLike) {
    if (isCallable(Array.from)) {
        return Array.from(arrayLike);
    }
    var array = [];
    var length = arrayLike.length;
    for (var i = 0;i < length; i++) {
        array.push(arrayLike[i]);
    }
    return array;
};

function ip (value, ref) {
    if ( ref === void 0 ) ref = [];
    var version = ref[0]; if ( version === void 0 ) version = 4;

    if (isNullOrUndefined(value)) {
        value = '';
    }
    if (Array.isArray(value)) {
        return value.every(function (val) { return isIP(val, version); });
    }
    return isIP(value, version);
}

function is (value, ref) {
	if ( ref === void 0 ) ref = [];
	var other = ref[0];

	return value === other;
}

function is_not (value, ref) {
	if ( ref === void 0 ) ref = [];
	var other = ref[0];

	return value !== other;
}

var compare = function (value, length, max) {
    if (max === undefined) {
        return value.length === length;
    }
    max = Number(max);
    return value.length >= length && value.length <= max;
};
function length (value, ref) {
    var length = ref[0];
    var max = ref[1]; if ( max === void 0 ) max = undefined;

    length = Number(length);
    if (value === undefined || value === null) {
        return false;
    }
    if (typeof value === 'number') {
        value = String(value);
    }
    if (!value.length) {
        value = toArray(value);
    }
    return compare(value, length, max);
}

function integer (value) {
    if (Array.isArray(value)) {
        return value.every(function (val) { return /^-?[0-9]+$/.test(String(val)); });
    }
    return /^-?[0-9]+$/.test(String(value));
}

function max$1 (value, ref) {
    var length = ref[0];

    if (value === undefined || value === null) {
        return length >= 0;
    }
    return String(value).length <= length;
}

function max_value (value, ref) {
    var max = ref[0];

    if (Array.isArray(value) || value === null || value === undefined || value === '') {
        return false;
    }
    return Number(value) <= max;
}

function mimes (files, mimes) {
    var regex = new RegExp(((mimes.join('|').replace('*', '.+')) + "$"), 'i');
    return files.every(function (file) { return regex.test(file.type); });
}

function min$1 (value, ref) {
    var length = ref[0];

    if (value === undefined || value === null) {
        return false;
    }
    return String(value).length >= length;
}

function min_value (value, ref) {
    var min = ref[0];

    if (Array.isArray(value) || value === null || value === undefined || value === '') {
        return false;
    }
    return Number(value) >= min;
}

var validate$9 = function (value, options) {
    if (Array.isArray(value)) {
        return value.every(function (val) { return validate$9(val, options); });
    }
    return !options.filter(function (option) { return option == value; }).length;
};

function numeric (value) {
    if (Array.isArray(value)) {
        return value.every(function (val) { return /^[0-9]+$/.test(String(val)); });
    }
    return /^[0-9]+$/.test(String(value));
}

function regex (value, ref) {
    var regex = ref[0];
    var flags = ref.slice(1);

    if (regex instanceof RegExp) {
        return regex.test(value);
    }
    return new RegExp(regex, flags).test(String(value));
}

function required (value, ref) {
    if ( ref === void 0 ) ref = [];
    var invalidateFalse = ref[0]; if ( invalidateFalse === void 0 ) invalidateFalse = false;

    if (Array.isArray(value)) {
        return !(!value.length);
    }
    if (value === false && invalidateFalse) {
        return false;
    }
    if (value === undefined || value === null) {
        return false;
    }
    return !(!String(value).trim().length);
}

function size (files, ref) {
    var size = ref[0];

    if (isNaN(size)) {
        return false;
    }
    var nSize = Number(size) * 1024;
    for (var i = 0;i < files.length; i++) {
        if (files[i].size > nSize) {
            return false;
        }
    }
    return true;
}

var isURL_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = isURL;
    var _assertString2 = _interopRequireDefault(assertString_1);
    var _isFQDN2 = _interopRequireDefault(isFQDN_1);
    var _isIP2 = _interopRequireDefault(isIP_1);
    var _merge2 = _interopRequireDefault(merge_1);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    
    var default_url_options = {
        protocols: ['http','https','ftp'],
        require_tld: true,
        require_protocol: false,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false
    };
    var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;
    function isRegExp(obj) {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
    }
    
    function checkHost(host, matches) {
        for (var i = 0;i < matches.length; i++) {
            var match = matches[i];
            if (host === match || isRegExp(match) && match.test(host)) {
                return true;
            }
        }
        return false;
    }
    
    function isURL(url, options) {
        (0, _assertString2.default)(url);
        if (!url || url.length >= 2083 || /[\s<>]/.test(url)) {
            return false;
        }
        if (url.indexOf('mailto:') === 0) {
            return false;
        }
        options = (0, _merge2.default)(options, default_url_options);
        var protocol = void 0, auth = void 0, host = void 0, hostname = void 0, port = void 0, port_str = void 0, split = void 0, ipv6 = void 0;
        split = url.split('#');
        url = split.shift();
        split = url.split('?');
        url = split.shift();
        split = url.split('://');
        if (split.length > 1) {
            protocol = split.shift();
            if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
                return false;
            }
        } else if (options.require_protocol) {
            return false;
        } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
            split[0] = url.substr(2);
        }
        url = split.join('://');
        if (url === '') {
            return false;
        }
        split = url.split('/');
        url = split.shift();
        if (url === '' && !options.require_host) {
            return true;
        }
        split = url.split('@');
        if (split.length > 1) {
            auth = split.shift();
            if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
                return false;
            }
        }
        hostname = split.join('@');
        port_str = null;
        ipv6 = null;
        var ipv6_match = hostname.match(wrapped_ipv6);
        if (ipv6_match) {
            host = '';
            ipv6 = ipv6_match[1];
            port_str = ipv6_match[2] || null;
        } else {
            split = hostname.split(':');
            host = split.shift();
            if (split.length) {
                port_str = split.join(':');
            }
        }
        if (port_str !== null) {
            port = parseInt(port_str, 10);
            if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
                return false;
            }
        }
        if (!(0, _isIP2.default)(host) && !(0, _isFQDN2.default)(host, options) && (!ipv6 || !(0, _isIP2.default)(ipv6, 6))) {
            return false;
        }
        host = host || ipv6;
        if (options.host_whitelist && !checkHost(host, options.host_whitelist)) {
            return false;
        }
        if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
            return false;
        }
        return true;
    }
    
    module.exports = exports['default'];
});
var isURL = unwrapExports(isURL_1)

function url (value, ref) {
    if ( ref === void 0 ) ref = [];
    var requireProtocol = ref[0]; if ( requireProtocol === void 0 ) requireProtocol = false;

    var options = {
        require_protocol: !(!requireProtocol),
        allow_underscores: true
    };
    if (isNullOrUndefined(value)) {
        value = '';
    }
    if (Array.isArray(value)) {
        return value.every(function (val) { return isURL(val, options); });
    }
    return isURL(value, options);
}

var index = {
    after: after,
    alpha_dash: validate$1,
    alpha_num: validate$2,
    alpha_spaces: validate$3,
    alpha: validate,
    before: before,
    between: validate$4,
    confirmed: confirmed,
    credit_card: credit_card,
    date_between: date_between,
    date_format: date_format,
    decimal: validate$5,
    digits: validate$6,
    dimensions: dimensions,
    email: validate$7,
    ext: ext,
    image: image,
    in: validate$8,
    integer: integer,
    length: length,
    ip: ip,
    is_not: is_not,
    is: is,
    max: max$1,
    max_value: max_value,
    mimes: mimes,
    min: min$1,
    min_value: min_value,
    not_in: validate$9,
    numeric: numeric,
    regex: regex,
    required: required,
    size: size,
    url: url
}

export default index;
export { after, validate$1 as alpha_dash, validate$2 as alpha_num, validate$3 as alpha_spaces, validate as alpha, before, validate$4 as between, confirmed, credit_card, date_between, date_format, validate$5 as decimal, validate$6 as digits, dimensions, validate$7 as email, ext, image, validate$8 as In, integer, length, ip, is_not, is, max$1 as max, max_value, mimes, min$1 as min, min_value, validate$9 as not_in, numeric, regex, required, size, url };
