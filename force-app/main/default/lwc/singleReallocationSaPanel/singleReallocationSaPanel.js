import { LightningElement, api } from 'lwc';

export default class SingleReallocationSaPanel extends LightningElement {

    @api countriesdata;
    @api handleClickApply;
    @api handleChangeBox;
    @api handleSelectAll;
    @api handleDeselectAll;
    @api handleSearchBox;
    @api inputEnabledFirst;
}