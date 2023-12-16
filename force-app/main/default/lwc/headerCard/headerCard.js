import { LightningElement, api } from 'lwc';

export default class HeaderCard extends LightningElement {
    @api title; 
    @api iconName;
}
