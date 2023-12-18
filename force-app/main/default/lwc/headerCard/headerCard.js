import { LightningElement, api } from 'lwc';

export default class HeaderCard extends LightningElement {
    @api h1;
    @api h2;
    @api iconName;
    @api iconSize = 'medium';
    @api backgroundColor;

    get headerClass() {
        let bgClass = '';
        if (this.backgroundColor) {
            bgClass = `bg-color-${this.backgroundColor.replace('#', '')}`;
            this.applyDynamicStyle(bgClass, this.backgroundColor);
        }
        return `slds-card__header slds-grid ${bgClass} header-card-custom`;
    }

    applyDynamicStyle(className, bgColor) {
        const style = document.createElement('style');
        style.innerText = `.${className} { background-color: ${bgColor}; }`;
        document.head.appendChild(style);
    }
}
