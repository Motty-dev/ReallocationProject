import { LightningElement, track } from 'lwc';
import getCountries from '@salesforce/apex/CountryService.getCountries';
import getStores from '@salesforce/apex/StoreService.getStores';
import getOwners from '@salesforce/apex/UserService.getOwners';
import getAccounts from '@salesforce/apex/AccountService.getAccounts';

export default class TestApexMethods extends LightningElement {
    @track data;
    @track error;

    testGetCountries() {
        getCountries()
            .then(result => {
                this.data = 'Countries: ' + JSON.stringify(result, null, 2);
                this.error = undefined;
                
            })
            .catch(error => {
                this.error = error;
                this.data = undefined;
            });
    }

    testGetStores() {
        let listCounries = ['a00Qy000003lT1fIAE','a00Qy000003lT1eIAE']; 

        getStores({ countryList: listCounries }) // Passing an empty array to fetch all stores
            .then(result => {
                this.data = 'Stores: ' + JSON.stringify(result, null, 2);
                this.error = undefined;
                console.log(this.data);
            })
            .catch(error => {
                this.error = error;
                this.data = undefined;
            });
    }

    testGetOwners() {
        // Replace with actual store IDs from your org
        let listStores = ['a01Qy000005QR3KIAW','a01Qy000005QR3QIAW']; 
       
        getOwners( {storesList: listStores})
            .then(result => {
                this.data = 'Owners: ' + JSON.stringify(result, null, 2);
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.data = undefined;
            });
    }
    

    testGetAccounts() {
        // Replace with actual owner IDs from your org
        let listOwners = ['005Qy0000019SMSIA2', '005Qy000001FJxyIAG'];
        getAccounts({ listOwners})
            .then(result => {
                this.data = 'Accounts: ' + JSON.stringify(result, null, 2);
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.data = undefined;
            });
    }
    
}
