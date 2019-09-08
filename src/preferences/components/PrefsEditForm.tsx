import React from 'react';
import { Formik, withFormik, FormikBag } from 'formik';
import { IPrefs } from '../../appSettings';


const ContentDivider = () => (<div className="widget_content_divider"></div>);

export const PrefsEditFormComp = (props: { values: IPrefs, [key: string]: any }) => {
    const {
        values,
        name,
        touched,
        handleChange,
        handleBlur,
        errors,
        setFieldValue,
        setFieldTouched
    } = props;

    return (
        <>
            <h4>PMU Soap Api Configuration</h4>
            <table>
                <tr>
                    <td><span>Host</span></td>
                    <td>
                        <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.pmu.soap.host}
                            name={`${name}.pmu.soap.host`}
                        />
                    </td>
                </tr>
                <tr>
                    <td><span>Path</span></td>
                    <td>
                        <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.pmu.soap.path}
                            name={`${name}.pmu.soap.path`}
                        />
                    </td>
                </tr>
                <tr>
                    <td><span>Port</span></td>
                    <td>
                        <input
                            type="number"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.pmu.soap.port}
                            name={`${name}.pmu.soap.port`}
                        />
                    </td>
                </tr>
                <tr>
                    <td><span>Username</span></td>
                    <td>
                        <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.pmu.soap.username}
                            name={`${name}.pmu.soap.username`}
                        />
                    </td>
                </tr>
                <tr>
                    <td><span>Password</span></td>
                    <td>
                        <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.pmu.soap.password}
                            name={`${name}.pmu.soap.password`}
                        />
                    </td>
                </tr>
            </table>
            <h4>PMU Web Api Configuration</h4>
            <table>
                <tr>
                    <td><span>Host</span></td>
                    <td>
                        <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.pmu.api.host}
                            name={`${name}.pmu.api.host`}
                        />
                    </td>
                </tr>
                <tr>
                    <td><span>Port</span></td>
                    <td>
                        <input
                            type="number"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.pmu.api.port}
                            name={`${name}.pmu.api.port`}
                        />
                    </td>
                </tr>
                <tr>
                    <td><span>API Path</span></td>
                    <td>
                        <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.pmu.api.path}
                            name={`${name}.pmu.api.path`}
                        />
                    </td>
                </tr>
            </table>
            <h4>SCADA Web Api Configuration</h4>
            <table>
                <tr>
                    <td><span>Host</span></td>
                    <td>
                        <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.scada.api.host}
                            name={`${name}.scada.api.host`}
                        />
                    </td>
                </tr>
                <tr>
                    <td><span>Port</span></td>
                    <td>
                        <input
                            type="number"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.scada.api.port}
                            name={`${name}.scada.api.port`}
                        />
                    </td>
                </tr>
                <tr>
                    <td><span>API Path</span></td>
                    <td>
                        <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.scada.api.path}
                            name={`${name}.scada.api.path`}
                        />
                    </td>
                </tr>
            </table>
            <h4>WBES Fetch Configuration</h4>
            <table>
                <tr>
                    <td><span>Host</span></td>
                    <td>
                        <input
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.wbes.host}
                            name={`${name}.wbes.host`}
                        />
                    </td>
                </tr>
            </table>
        </>
    )
};

export const PrefsEditForm = (props) => {
    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        isSubmitting
    } = props;
    let nameStr = 'prefs';

    return (
        <form className="form_div" onSubmit={handleSubmit}>
            <div>
                <PrefsEditFormComp
                    name={nameStr}
                    values={values[nameStr]}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                />

                <button type="submit" disabled={isSubmitting}>Save User Preferences</button>

                {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
            </div>
        </form>
    )
};


export const FormikPrefsEditForm = withFormik<{ prefs: IPrefs, onFormSubmit }, { prefs: IPrefs }, { prefs: IPrefs }>({
    mapPropsToValues: (props) => ({
        prefs: JSON.parse(JSON.stringify(props.prefs))
    }),

    validate: values => {
        const errors = {};
        return errors;
    },

    handleSubmit: (values, { props, setSubmitting }) => {
        // alert(JSON.stringify(values));
        props.onFormSubmit(values.prefs);
        setSubmitting(false);
    },

    displayName: 'PrefsEditForm',
})(PrefsEditForm);