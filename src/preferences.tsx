import React from 'react';
import { render } from 'react-dom';
import './preferences.css';
import PreferencesEditor from './preferences/components/PreferencesEditor';

render(
    <PreferencesEditor></PreferencesEditor>,
    document.getElementById('root')
);