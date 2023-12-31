import { LightningElement } from 'lwc';
export default class ModalPopup extends LightningElement {
    
    
    closeModal() {
        this.dispatchEvent(new CustomEvent('closemdoel'));
    }
    submitDetails() {
        this.dispatchEvent(new CustomEvent('updatecustomers'));
    }
}
