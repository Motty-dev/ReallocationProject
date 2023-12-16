import { LightningElement, track } from 'lwc';

export default class BaseComponent extends LightningElement {
    @track isSingleSelected = true;
    @track isMassSelected = false;

    get singleVariant() {
        return this.isSingleSelected ? 'brand' : 'neutral';
    }

    get massVariant() {
        return this.isMassSelected ? 'brand' : 'neutral';
    }

    handleSingleClick() {
        this.isSingleSelected = true;
        this.isMassSelected = false;
    }

    handleMassClick() {
        this.isSingleSelected = false;
        this.isMassSelected = true;
    }
}