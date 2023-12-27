import { LightningElement, api } from 'lwc';

export default class SaCard extends LightningElement {
    @api componentId;
    @api ownerName;
    @api ownerId;
    @api storeName;
    @api storeId;
    @api accountCount;
}