import { LitElement, CSSResultGroup, TemplateResult } from 'lit';
import { LovelaceCardEditor } from 'custom-card-helpers';
import type { HomeAssistant } from 'custom-card-helpers';
import { AlarmClockCardConfig } from './alarm-clock-card';
export declare class AlarmClockCardEditor extends LitElement implements LovelaceCardEditor {
    hass: HomeAssistant;
    private _config;
    private _helpers?;
    private _searchValue;
    private _showDropdown;
    private _filteredDevices;
    private _allDevices;
    setConfig(config: AlarmClockCardConfig): void;
    get _device_id(): string;
    get _name(): string;
    get _show_time_picker(): boolean;
    get _show_days(): boolean;
    get _show_scripts(): boolean;
    get _show_snooze_info(): boolean;
    protected render(): TemplateResult;
    private _loadDevices;
    private _handleSearch;
    private _showResults;
    private _hideResults;
    private _selectDevice;
    private _nameChanged;
    private _toggleChanged;
    private _valueChanged;
    static get styles(): CSSResultGroup;
}
declare global {
    interface HTMLElementTagNameMap {
        'alarm-clock-card-editor': AlarmClockCardEditor;
    }
}
//# sourceMappingURL=alarm-clock-card-editor.d.ts.map