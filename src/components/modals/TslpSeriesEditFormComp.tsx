import React from 'react';
import { VarTimeEditFormComp } from '../../variable_time/VarTimeEditFormComp';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';
import { MeasEditFormComp } from './MeasEditFormComp';
import { PlotlyRenderStrategy, TslpSeriesStyle } from '../ITimeSeriesLinePlot';

const SeriesCompDivider = () => (<div className="series_divider"><hr /></div>);

export const TslpSeriesEditFormComp = (props) => {
    const {
        values,
        name,
        onDeleteClick,
        onDuplicateClick,
        onTimeOverwriteClick,
        touched,
        handleChange,
        handleBlur,
        errors,
        setFieldValue,
        setFieldTouched
    } = props;
    return (
        <>
            <span><b>Series Title{" "}</b></span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                name={`${name}.title`}
            />
            <button type="button" onClick={onDuplicateClick} className="duplicate_series_btn">Duplicate Series</button>
            <button type="button" onClick={onTimeOverwriteClick} className="time_overwrite_series_btn">Time Overwrite all Series</button>
            <button type="button" onClick={onDeleteClick} className="delete_series_btn">Delete Series</button>

            <SeriesCompDivider />

            <span><b>Series Color{" "}</b></span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.color}
                name={`${name}.color`}
            />

            <SeriesCompDivider />

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

            <SeriesCompDivider />

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

            <SeriesCompDivider />

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

            <SeriesCompDivider />

            <div>
                <span><b>Display Time Shift</b></span>
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

            <span><b>Line Width{" "}</b></span>
            <input
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.size}
                name={`${name}.size`}
            />

            <SeriesCompDivider />

            <span><b>Visualization{" "}</b></span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.seriesStyle}
                name={`${name}.seriesStyle`}
            >
                <option value={TslpSeriesStyle.line}>Normal Timeseries</option>
                <option value={TslpSeriesStyle.duration}>Duration Curve</option>
            </select>

            <SeriesCompDivider />

            <span><b>Plotly Render Strategy{" "}</b></span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.renderStrategy}
                name={`${name}.renderStrategy`}
            >
                <option value={PlotlyRenderStrategy.scatter}>No GPU</option>
                <option value={PlotlyRenderStrategy.scattergl}>Use GPU</option>
            </select>
        </>
    )
};