import { LightningElement, api, track, wire } from 'lwc';

export default class SingleReallocationResult extends LightningElement {
    @api columns;
    @api accountsData;
}