import React from 'react';
import { TslpSeriesEditFormComp } from './TslpSeriesEditFormComp';
import { Formik, withFormik, FormikBag } from 'formik';
import { ITslpProps, TslpSeriesProps } from '../ITimeSeriesLinePlot';
import { IDashWidgetContentProps } from '../IDashWidgetContent';
import { PMUMeasurement } from '../../measurements/PMUMeasurement';
import { ScadaMeasurement } from '../../measurements/ScadaMeasurement';
import { DummyMeasurement } from '../../measurements/DummyMeasurement';

const WidgetContentDivider = () => (<div className="widget_content_divider"></div>);

export const TslpEditFormComp = (props) => {
    const {
        values,
        onDeleteSeriesClick,
        onDuplicateSeriesClick,
        name,
        touched,
        handleChange,
        handleBlur,
        errors,
        setFieldValue,
        setFieldTouched
    } = props;
    let TslpSeriesFormComps = [];
    for (let seriesIter = 0; seriesIter < values.seriesList.length; seriesIter++) {
        TslpSeriesFormComps.push(
            <div key={`tslpSeriesEditFormComp_${seriesIter}`} className="series_edit_item">
                <TslpSeriesEditFormComp
                    name={`${name}.seriesList.${seriesIter}`}
                    values={{ ...values.seriesList[seriesIter], points: [] }}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    onDeleteClick={onDeleteSeriesClick(seriesIter)}
                    onDuplicateClick={onDuplicateSeriesClick(seriesIter)}
                />
                <WidgetContentDivider />
            </div>
        );
    }

    return (
        <>
            <span>Title</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                name={`${name}.title`}
            />

            <WidgetContentDivider />

            {
                values.backgroundColor &&
                <>< input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name={`${name}.backgroundColor`}
                    value={values.backgroundColor}

                />
                    <WidgetContentDivider />
                </>
            }

            {TslpSeriesFormComps}
        </>
    )
};

export const TslpEditForm = (props) => {
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
    let nameStr = 'tslpProps';
    const onAddSeriesClick = () => {
        let seriesProps = new TslpSeriesProps();
        seriesProps.fromVarTime.absoluteTime = new Date().getTime() - 4*60*1000;
        seriesProps.toVarTime.absoluteTime = new Date().getTime() - 2*60*1000;
        if (values.newMeasType == ScadaMeasurement.typename) {
            seriesProps.meas = new ScadaMeasurement();
        } else if (values.newMeasType == PMUMeasurement.typename) {
            seriesProps.meas = new PMUMeasurement();
        } else if (values.newMeasType == DummyMeasurement.typename) {
            seriesProps.meas = new DummyMeasurement();
        }
        setFieldValue(`${nameStr}.seriesList`, [...values[nameStr].seriesList, seriesProps]);
    };

    const onDeleteSeriesClick = (ind: number) => {
        return () =>
            setFieldValue(`${nameStr}.seriesList`,
                [
                    ...values[nameStr].seriesList.slice(0, ind),
                    ...values[nameStr].seriesList.slice(ind + 1)
                ]
            );
    };

    const onDuplicateSeriesClick = (ind: number) => {
        return () => {
            const newSeries = { ...values[nameStr].seriesList[ind] };
            setFieldValue(`${nameStr}.seriesList`,
                [
                    ...values[nameStr].seriesList.slice(0, ind + 1),
                    newSeries,
                    ...values[nameStr].seriesList.slice(ind + 1)
                ]
            );
        }
    };

    return (
        <div className="form_div">
            <div>
                <select
                    name="newMeasType"
                    value={values.newMeasType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    <option value={ScadaMeasurement.typename}>Scada</option>
                    <option value={PMUMeasurement.typename}>PMU</option>
                    <option value={DummyMeasurement.typename}>Random</option>
                </select>
                <button onClick={onAddSeriesClick}>Add Series</button>
            </div>
            <form onSubmit={handleSubmit}>
                <TslpEditFormComp
                    name={nameStr}
                    values={values[nameStr]}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    onDeleteSeriesClick={onDeleteSeriesClick}
                    onDuplicateSeriesClick={onDuplicateSeriesClick}
                />

                <button type="submit" disabled={isSubmitting}>Submit</button>

                {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
            </form>
        </div>
    )
};


export const FormikTslpEditForm = withFormik<{ ind: number, tslpProps: ITslpProps, onFormSubmit }, { tslpProps: ITslpProps }, { tslpProps: ITslpProps, newMeasType: string }>({
    mapPropsToValues: (props) => ({
        tslpProps: { ...props.tslpProps },
        newMeasType: ScadaMeasurement.typename
    }),

    validate: values => {
        const errors = {};
        return errors;
    },

    handleSubmit: (values, { props, setSubmitting }) => {
        // alert(JSON.stringify(values));
        props.onFormSubmit(values.tslpProps, props.ind);
        setSubmitting(false);
    },

    displayName: 'TslpEditForm',
})(TslpEditForm);