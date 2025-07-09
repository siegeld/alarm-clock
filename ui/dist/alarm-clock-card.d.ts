import { LitElement, CSSResultGroup, TemplateResult, PropertyValues } from 'lit';
import { LovelaceCardEditor, LovelaceCard } from 'custom-card-helpers';
import type { HomeAssistant, LovelaceCardConfig, ActionConfig } from 'custom-card-helpers';
export interface AlarmClockCardConfig extends LovelaceCardConfig {
    type: string;
    device_id: string;
    name?: string;
    show_time_picker?: boolean;
    show_days?: boolean;
    show_scripts?: boolean;
    show_snooze_info?: boolean;
    theme?: string;
    tap_action?: ActionConfig;
    hold_action?: ActionConfig;
    double_tap_action?: ActionConfig;
}
export declare class AlarmClockCard extends LitElement implements LovelaceCard {
    static getConfigElement(): Promise<LovelaceCardEditor>;
    static getStubConfig(): AlarmClockCardConfig;
    hass: HomeAssistant;
    private config;
    private entities;
    setConfig(config: AlarmClockCardConfig): void;
    protected shouldUpdate(changedProps: PropertyValues): boolean;
    protected firstUpdated(): Promise<void>;
    private _updateEntities;
    protected render(): TemplateResult;
    private _renderTimePicker;
    private _renderControls;
    private _renderDays;
    private _renderScriptsInfo;
    private _renderSnoozeInfo;
    private _onTimeInputChange;
    private _onSetTimeButtonClick;
    private _setAlarmTime;
    private _toggleAlarm;
    private _toggleDay;
    private _snoozeAlarm;
    private _dismissAlarm;
    getCardSize(): number;
    static get styles(): CSSResultGroup;
}
declare global {
    interface HTMLElementTagNameMap {
        'alarm-clock-card': AlarmClockCard;
    }
}
//# sourceMappingURL=alarm-clock-card.d.ts.map