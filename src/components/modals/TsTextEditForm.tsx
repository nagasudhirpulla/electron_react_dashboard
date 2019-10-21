import React from 'react';
import { Formik, withFormik, FormikBag } from 'formik';
// import { IDashWidgetContentProps } from '../IDashWidgetContent';
import { PMUMeasurement } from '../../measurements/PMUMeasurement';
import { ScadaMeasurement } from '../../measurements/ScadaMeasurement';
import { DummyMeasurement } from '../../measurements/DummyMeasurement';
import { WbesMeasurement } from './../../measurements/WbesMeasurement';
import { AdaptersListItem } from '../../adapters/components/AdaptersList';
import { AdapterMeasurement } from '../../measurements/AdapterMeasurement';
import { ITsTextProps, TextComputationStrategy, TsTextProps } from '../ITimeSeriesText';
import { VarTimeEditFormComp } from '../../variable_time/VarTimeEditFormComp';
import { MeasEditFormComp } from './MeasEditFormComp';
import { IMeasurement } from './../../measurements/IMeasurement';
const showConfirmationDialog = require('electron').remote.dialog.showMessageBox;

const WidgetContentDivider = () => (<div className="widget_content_divider"></div>);

export const TsTextEditFormComp = (props) => {
    const {
        values,
        name,
        touched,
        handleChange,
        handleBlur,
        errors,
        setFieldValue,
        setFieldTouched
    }: { values: ITsTextProps, [key: string]: any } = props;
    return (
        <>
            <span>Prefix{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.prefixText}
                name={`${name}.prefixText`}
            />
            <WidgetContentDivider />

            <span>Suffix{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.suffixText}
                name={`${name}.suffixText`}
            />
            <WidgetContentDivider />

            <div>
                <span><b>From Time</b></span>
                <VarTimeEditFormComp
                    name={`${name}.fromVarTime`}
                    values={values.fromVarTime}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched} />
            </div>
            <WidgetContentDivider />

            <div>
                <span><b>To Time</b></span>
                <VarTimeEditFormComp
                    name={`${name}.toVarTime`}
                    values={values.toVarTime}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched} />
            </div>
            <WidgetContentDivider />

            <div>
                <span><b>Measurement</b>{` (${values.meas.discriminator}) `}</span>
                <MeasEditFormComp
                    name={`${name}.meas`}
                    values={values.meas}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                />
            </div>
            <WidgetContentDivider />

            <span>Text Computation Strategy{" "}</span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.textComputationStrategy}
                name={`${name}.textComputationStrategy`}
            >
                <option value={TextComputationStrategy.firstSample}>First Sample</option>
                <option value={TextComputationStrategy.lastSample}>Last Sample</option>
                <option value={TextComputationStrategy.average}>Average</option>
                <option value={TextComputationStrategy.max}>Maximum</option>
                <option value={TextComputationStrategy.min}>Minimum</option>
                <option value={TextComputationStrategy.percentile}>Percentile</option>
                <option value={TextComputationStrategy.sum}>Sum</option>
                <option value={TextComputationStrategy.noData}>No Data</option>
            </select>
            <WidgetContentDivider />

            {values.textComputationStrategy == TextComputationStrategy.percentile &&
                <>
                    <span>Percentile{" "}</span>
                    <input
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.percentile}
                        name={`${name}.percentile`}
                    />
                    <WidgetContentDivider />
                </>
            }

            <span>Font Color{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                name={`${name}.fontColor`}
                value={values.fontColor}
            />
            <WidgetContentDivider />

            <span>Highlight Color{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                name={`${name}.backgroundColor`}
                value={values.backgroundColor}
            />
            <WidgetContentDivider />

            <span>Font Style{" "}</span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fontStyle}
                name={`${name}.fontStyle`}
            >
                <option value="normal">normal</option>
                <option value="italic">italic</option>
            </select>
            <WidgetContentDivider />

            <span>Font Weight{" "}</span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fontWeight}
                name={`${name}.fontWeight`}
            >
                <option value="normal">normal</option>
                <option value="bold">bold</option>
                <option value="bolder">bolder</option>
                <option value="lighter">lighter</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
            </select>
            <WidgetContentDivider />

            <span>Font Family{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fontFamily}
                name={`${name}.fontFamily`}
            />
            <WidgetContentDivider />

            <span>Font Size{" "}</span>
            <input
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fontSize}
                name={`${name}.fontSize`}
            />
            <WidgetContentDivider />

            <span>Max Decimal Places{" "}</span>
            <input
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.decimalPrecision}
                name={`${name}.decimalPrecision`}
            />
            <WidgetContentDivider />

            <span>Border{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                name={`${name}.border`}
                value={values.border}
            />
        </>
    )
};

export const TsTextEditForm = (props) => {
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
    }: { values: { tsTextProps: ITsTextProps, newMeasType: string, adapters: AdaptersListItem[] }, [key: string]: any } = props;
    let nameStr = 'tsTextProps';

    const onChangeMeasClick = () => {
        let meas: IMeasurement;
        if (values.newMeasType == ScadaMeasurement.typename) {
            meas = new ScadaMeasurement();
        } else if (values.newMeasType == PMUMeasurement.typename) {
            meas = new PMUMeasurement();
        } else if (values.newMeasType == DummyMeasurement.typename) {
            meas = new DummyMeasurement();
        } else if (values.newMeasType == WbesMeasurement.typename) {
            meas = new WbesMeasurement();
        } else {
            meas = new AdapterMeasurement();
            (meas as AdapterMeasurement).adapter_id = values.newMeasType;
        }
        setFieldValue(`${nameStr}.meas`, { ...meas });
    };

    let measOptionEls = [];
    for (let measTypeInd = 0; measTypeInd < values.adapters.length; measTypeInd++) {
        const optEl = <option value={values.adapters[measTypeInd].adapter_id}>{values.adapters[measTypeInd].name}</option>;
        measOptionEls.push(optEl);
    }

    return (
        <form className="form_div" onSubmit={handleSubmit}>
            <div>
                <select
                    name="newMeasType"
                    value={values.newMeasType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    <option value={ScadaMeasurement.typename}>Scada</option>
                    <option value={PMUMeasurement.typename}>PMU</option>
                    <option value={WbesMeasurement.typename}>WBES</option>
                    <option value={DummyMeasurement.typename}>Random</option>
                    {measOptionEls}
                </select>
                <button type="button" onClick={onChangeMeasClick} className='duplicate_series_btn'>Change Measurement Type</button>
            </div>
            <div>
                <TsTextEditFormComp
                    name={nameStr}
                    values={values[nameStr]}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                />

                <button type="submit" disabled={isSubmitting}>Submit</button>

                {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
            </div>
        </form>
    )
};


export const FormikTsTextEditForm = withFormik<{ ind: number, tsTextProps: ITsTextProps, adapters: AdaptersListItem[], onFormSubmit }, { tsTextProps: ITsTextProps }, { tsTextProps: ITsTextProps, newMeasType: string, adapters: AdaptersListItem[] }>({
    mapPropsToValues: (props) => ({
        tsTextProps: JSON.parse(JSON.stringify(props.tsTextProps)),
        newMeasType: ScadaMeasurement.typename,
        adapters: props.adapters
    }),

    validate: values => {
        const errors = {};
        return errors;
    },

    handleSubmit: (values, { props, setSubmitting }) => {
        // alert(JSON.stringify(values));
        props.onFormSubmit(values.tsTextProps, props.ind);
        setSubmitting(false);
    },

    displayName: 'TsTextEditForm',
})(TsTextEditForm);