import React from 'react';
import { VarTimeEditFormComp } from '../../variable_time/VarTimeEditFormComp';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';
import { MeasEditFormComp } from './MeasEditFormComp';
import { PlotlyRenderStrategy } from '../ITimeSeriesLinePlot';

const SeriesCompDivider = () => (<div className="series_divider"><hr /></div>);

export const TslpSeriesEditFormComp = (props) => {
    const {
        values,
        name,
        onDeleteClick,
        onDuplicateClick,
        touched,
        handleChange,
        handleBlur,
        errors,
        setFieldValue,
        setFieldTouched
    } = props;
    return (
        <>
            <span>Series Title</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                name={`${name}.title`}
            />
            <button onClick={onDeleteClick} className="delete_series_btn">Delete Series</button>
            <button onClick={onDuplicateClick} className="duplicate_series_btn">Duplicate Series</button>

            <SeriesCompDivider />

            <span>Plotly Render Strategy</span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.renderStrategy}
                name={`${name}.renderStrategy`}
            >
                <option value={PlotlyRenderStrategy.scatter}>No GPU</option>
                <option value={PlotlyRenderStrategy.scattergl}>Use GPU</option>
            </select>

            <SeriesCompDivider />

            <span>Series Color</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.color}
                name={`${name}.color`}
            />

            <SeriesCompDivider />

            <div>
                <span>From Time</span>
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

            <SeriesCompDivider />

            <div>
                <span>To Time</span>
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

            <SeriesCompDivider />

            <div>
                <span>Display Time Shift</span>
                <TimePeriodEditFormComp
                    name={`${name}.displayTimeShift`}
                    values={values.displayTimeShift}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched} />
            </div>

            <SeriesCompDivider />

            <div>
                <span>Measurement{` (${values.meas.discriminator})`}</span>
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
        </>
    )
};