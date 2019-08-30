import React from 'react';
import DateTime from 'react-datetime';
import moment from 'moment';

export const VarTimeEditFormComp = ({
    values,
    name,
    touched,
    handleChange,
    handleBlur,
    errors,
    setFieldValue,
    setFieldTouched,
    ...props
}) => {
    const onAbsTimeChange = value => {
        if (value instanceof moment) {
            let dateObj = (moment(value).toDate()).getTime();
            setFieldValue(`${name}.absoluteTime`, dateObj);
        }
    };

    const onAllVarCheckChanged = evnt => {
        let newBool = false;
        if (evnt.target.checked) {
            newBool = true;
        }
        setFieldValue(`${name}.isVarDays`, newBool);
        setFieldValue(`${name}.isVarMonths`, newBool);
        setFieldValue(`${name}.isVarYears`, newBool);
        setFieldValue(`${name}.isVarHrs`, newBool);
        setFieldValue(`${name}.isVarMins`, newBool);
        setFieldValue(`${name}.isVarSecs`, newBool);
    };

    const onAbsTimeBlur = () => {
        setFieldTouched(`${name}.absoluteTime`, true);
    };

    return (
        <div>
            <div>
                <DateTime
                    name={`${name}.absoluteTime`}
                    value={values.absoluteTime}
                    dateFormat={'DD-MM-YYYY'}
                    timeFormat={'HH:mm:ss'}
                    onChange={onAbsTimeChange}
                    onBlur={onAbsTimeBlur}
                />
                <span>All Variable -{" "}</span>
                <input type="checkbox"
                    checked={values.isVarDays && values.isVarMonths && values.isVarYears && values.isVarHrs && values.isVarMins && values.isVarSecs}
                    onChange={onAllVarCheckChanged}
                />
            </div>

            <table>
                <tbody>
                    <tr>
                        <td>
                            <span>Offset Days</span>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                name={`${name}.isVarDays`}
                                onChange={handleChange}
                                checked={values.isVarDays}
                                onBlur={handleBlur}
                            />
                            <input
                                type="number"
                                name={`${name}.offsetDays`}
                                onChange={handleChange}
                                value={values.offsetDays}
                                onBlur={handleBlur}
                                className="num_input_width"
                            />
                        </td>

                        <td>
                            <span>Offset Months</span>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                name={`${name}.isVarMonths`}
                                onChange={handleChange}
                                checked={values.isVarMonths}
                                onBlur={handleBlur}
                            />

                            <input
                                type="number"
                                name={`${name}.offsetMonths`}
                                onChange={handleChange}
                                value={values.offsetMonths}
                                onBlur={handleBlur}
                                className="num_input_width"
                            />
                        </td>

                        <td>
                            <span>Offset Years</span>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                name={`${name}.isVarYears`}
                                onChange={handleChange}
                                checked={values.isVarYears}
                                onBlur={handleBlur}
                            />

                            <input
                                type="number"
                                name={`${name}.offsetYears`}
                                onChange={handleChange}
                                value={values.offsetYears}
                                onBlur={handleBlur}
                                className="num_input_width"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>Offset Hours</span>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                name={`${name}.isVarHrs`}
                                onChange={handleChange}
                                checked={values.isVarHrs}
                                onBlur={handleBlur}
                            />

                            <input
                                type="number"
                                name={`${name}.offsetHrs`}
                                onChange={handleChange}
                                value={values.offsetHrs}
                                onBlur={handleBlur}
                                className="num_input_width"
                            />
                        </td>

                        <td>
                            <span>Offset Minutes</span>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                name={`${name}.isVarMins`}
                                onChange={handleChange}
                                checked={values.isVarMins}
                                onBlur={handleBlur}
                            />

                            <input
                                type="number"
                                name={`${name}.offsetMins`}
                                onChange={handleChange}
                                value={values.offsetMins}
                                onBlur={handleBlur}
                                className="num_input_width"
                            />
                        </td>

                        <td>
                            <span>Offset Seconds</span>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                name={`${name}.isVarSecs`}
                                onChange={handleChange}
                                checked={values.isVarSecs}
                                onBlur={handleBlur}
                            />

                            <input
                                type="number"
                                name={`${name}.offsetSecs`}
                                onChange={handleChange}
                                value={values.offsetSecs}
                                onBlur={handleBlur}
                                className="num_input_width"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div >
    );
}