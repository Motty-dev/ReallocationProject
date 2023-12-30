import { LightningElement, api } from 'lwc';

export default class SaCard extends LightningElement {
    @api componentId;
    @api ownerName;
    @api ownerId;
    @api storeName;
    @api storeId;
    @api accountCount;

    handleRadioChange() {
        const selectedEvent = new CustomEvent('selected', {
            detail: { 
                ownerId: this.ownerId,
                ownerName: this.ownerName,
                storeId: this.storeId,
                storeName: this.storeName,
                accountCount: this.accountCount
            }
        });
        this.dispatchEvent(selectedEvent);
    }
}