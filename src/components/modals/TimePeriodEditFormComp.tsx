import React from 'react';

export const TimePeriodEditFormComp = ({
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
    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <span>Days -</span>
                    </td>
                    <td>
                        <input
                            type="number"
                            name={`${name}.days`}
                            onChange={handleChange}
                            value={values.days}
                            onBlur={handleBlur}
                            className="num_input_width"
                        />
                    </td>
                    <td>
                        <span>Months -</span>
                    </td>
                    <td>
                        <input
                            type="number"
                            name={`${name}.months`}
                            onChange={handleChange}
                            value={values.months}
                            onBlur={handleBlur}
                            className="num_input_width"
                        />
                    </td>
                    <td>
                        <span>Years -</span>
                    </td>
                    <td>
                        <input
                            type="number"
                            name={`${name}.years`}
                            onChange={handleChange}
                            value={values.years}
                            onBlur={handleBlur}
                            className="num_input_width"
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Hours -</span>
                    </td>
                    <td>
                        <input
                            type="number"
                            name={`${name}.hrs`}
                            onChange={handleChange}
                            value={values.hrs}
                            onBlur={handleBlur}
                            className="num_input_width"
                        />
                    </td>
                    <td>
                        <span>Mins -</span>
                    </td>
                    <td>
                        <input
                            type="number"
                            name={`${name}.mins`}
                            onChange={handleChange}
                            value={values.mins}
                            onBlur={handleBlur}
                            className="num_input_width"
                        />
                    </td>
                    <td>
                        <span>Secs -</span>
                    </td>
                    <td>
                        <input
                            type="number"
                            name={`${name}.secs`}
                            onChange={handleChange}
                            value={values.secs}
                            onBlur={handleBlur}
                            className="num_input_width"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};