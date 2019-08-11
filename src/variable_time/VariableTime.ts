export class VarTime {
    absoluteTime: Date = new Date();
    offsetDays: number = 0;
    offsetMonths: number = 0;
    offsetYears: number = 0;
    offsetHrs: number = 0;
    offsetMins: number = 0;
    offsetSecs: number = 0;
    isVarDays: boolean = false;
    isVarMonths: boolean = false;
    isVarYears: boolean = false;
    isVarHrs: boolean = false;
    isVarMins: boolean = false;
    isVarSecs: boolean = false;

    static addTime = (d: Date, offsetYears = 0, offsetMonths = 0, offsetDays = 0, offsetHrs = 0, offsetMins = 0, offsetSecs = 0, offsetMillis = 0): Date => {
        // https://stackoverflow.com/questions/33070428/add-year-to-todays-date
        return new Date(d.getFullYear() + offsetYears, d.getMonth() + offsetMonths, d.getDate() + offsetDays, d.getHours() + offsetHrs, d.getMinutes() + offsetMins, d.getSeconds() + offsetSecs, d.getMilliseconds() + offsetMillis);
    }

    static addYears = (d: Date, offsetVal = 0): Date => {
        return new Date(d.getFullYear() + offsetVal, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }

    static addMonths = (d: Date, offsetVal = 0): Date => {
        return new Date(d.getFullYear(), d.getMonth() + offsetVal, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }

    static addDays = (d: Date, offsetVal = 0): Date => {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + offsetVal, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }

    static addHrs = (d: Date, offsetVal = 0): Date => {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + offsetVal, d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }

    static addMins = (d: Date, offsetVal = 0): Date => {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + offsetVal, d.getSeconds(), d.getMilliseconds());
    }

    static addSecs = (d: Date, offsetVal = 0): Date => {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds() + offsetVal, d.getMilliseconds());
    }

    static setYears = (d: Date, setVal: number): Date => {
        return new Date(setVal, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }

    static setMonths = (d: Date, setVal: number): Date => {
        return new Date(d.getFullYear(), setVal, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }

    static setDays = (d: Date, setVal: number): Date => {
        return new Date(d.getFullYear(), d.getMonth(), setVal, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }

    static setHrs = (d: Date, setVal: number): Date => {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), setVal, d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }

    static setMins = (d: Date, setVal: number): Date => {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), setVal, d.getSeconds(), d.getMilliseconds());
    }

    static setSecs = (d: Date, setVal: number): Date => {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), setVal, d.getMilliseconds());
    }

    getDateObj(): Date {
        let absTime: Date = this.absoluteTime;
        let nowTime: Date = new Date();

        // Make millisecond component as zero for the absolute time and now time
        absTime = new Date(absTime.setMilliseconds(0))
        nowTime = new Date(nowTime.setMilliseconds(0))
        let resultTime: Date = nowTime;


        // Add offsets to current time as per the settings
        if (this.isVarYears) {
            resultTime = VarTime.addYears(resultTime, this.offsetYears);
        }
        if (this.isVarMonths) {
            resultTime = VarTime.addMonths(resultTime, this.offsetMonths);
        }
        if (this.isVarDays) {
            resultTime = VarTime.addDays(resultTime, this.offsetDays);
        }
        if (this.isVarHrs) {
            resultTime = VarTime.addHrs(resultTime, this.offsetHrs);
        }
        if (this.isVarMins) {
            resultTime = VarTime.addMins(resultTime, this.offsetMins);
        }
        if (this.isVarSecs) {
            resultTime = VarTime.addSecs(resultTime, this.offsetSecs);
        }

        // Set absolute time settings to the result time
        if (!this.isVarYears) {
            resultTime = VarTime.setYears(resultTime, absTime.getFullYear() );
        }
        if (!this.isVarMonths) {
            resultTime = VarTime.setMonths(resultTime, absTime.getMonth());
        }
        if (!this.isVarDays) {
            resultTime = VarTime.setDays(resultTime, absTime.getDate());
        }
        if (!this.isVarHrs) {
            resultTime = VarTime.setHrs(resultTime, absTime.getHours());
        }
        if (!this.isVarMins) {
            resultTime = VarTime.setMins(resultTime, absTime.getMinutes());
        }
        if (!this.isVarSecs) {
            resultTime = VarTime.setSecs(resultTime, absTime.getSeconds());
        }
        return resultTime;
    }
};