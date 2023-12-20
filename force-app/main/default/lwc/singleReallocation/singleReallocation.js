import { LightningElement, wire, track, api } from 'lwc';
import getCountries from '@salesforce/apex/CountryService.getCountries';
import getStores from '@salesforce/apex/StoreService.getStores';
import getOwners from '@salesforce/apex/UserService.getOwners';

export default class SingleReallocation extends LightningElement {

    @track countriesData = [];        //
    @track storesData = [];           //
    @track ownersData = []; 
    @track selectedCountries = [];    //
    @track selectedStores = [];       //

       
    @track selectedOwner;
    @track isCountryDisabled = false;
    @track isOwnerDisabled = true;
    @track isStoreDisabled = true;
    
    // Country Controllers ==============================================================>>>

    @wire(getCountries)
    wiredCountries({ error, data }) {
        if (data) {
            // console.log('1.1',data);
            this.countriesData = data.map(country => ({ Name: country.Name, Id: country.Id, isChecked: false, display: true }));
            // console.log('1.2',JSON.parse(JSON.stringify(this.countriesData)));
            // this.countriesData.forEach(item => console.log(item));
        } else if (error) {
            // Handle error
        }
    }

    handleClickApplyCountries(event) {
        this.selectedCountries = event.detail.selectedValues;
    }

    onChangeCheckboxCountries(event) {
        this.countriesData[event.detail.index].isChecked = event.detail.checked;
    }

    handleSelectAllCountries() {
        this.countriesData.forEach(item => {
            if(item.display) {
                item.isChecked = true;
            }
        });
    }

    handleDeselectAllCountries() {
        this.countriesData.forEach(item => item.isChecked = false);
    }

    handleSearchCountry(event) {
        this.countriesData.forEach(item => {
            item.display = item.Name.toLowerCase().includes(event.detail.search.toLowerCase())
        });
    }

    // Stores Controllers ==============================================================>>>

    @wire(getStores, { countryList: '$selectedCountries'})
    wiredStores({ error, data }) {
        if (data) {
            // console.log('2.1',data);
            this.storesData = data.map(store => ({ Name: store.Name, Id: store.Main_boutique__c, isChecked: false, display: true }));
            // console.log('2.2',JSON.parse(JSON.stringify(this.storesData)));
            // this.storesData.forEach(item => console.log(item));
        } else if (error) {
            // Handle error
        }
        
    }
    handleClickApplyStores(event) {
        this.selectedStores = event.detail.selectedValues;
    }

    onChangeCheckboxStore(event) {
        this.storesData[event.detail.index].isChecked = event.detail.checked;
    }

    handleSelectAllStores() {
        this.storesData.forEach(item => {
            if(item.display) {
                item.isChecked = true;
            }
        });
    }
    handleDeselectAllStores() {
        this.storesData.forEach(item => item.isChecked = false);
    }

    handleSearchStore(event) {
        this.storesData.forEach(item => {
            item.display = item.Name.toLowerCase().includes(event.detail.search.toLowerCase())
        });
    }


    // Owners Controllers ==============================================================>>>
}