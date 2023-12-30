public with sharing class SingleReallocationService {

    @AuraEnabled(cacheable=true)
    public static List<Country__c> getCountries() {
        return [SELECT Id, Name FROM Country__c ORDER BY Name];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getStores(List<String> countryList) {
        return [SELECT Main_boutique__r.Name, Main_boutique__r.Country__c, Main_boutique__c
                FROM Account 
                WHERE Main_boutique__c != null AND Main_boutique__r.Country__c IN :countryList
                GROUP BY Main_boutique__c, Main_boutique__r.Name, Main_boutique__r.Country__c
                ORDER BY Main_boutique__r.Name];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOwners(List<String> storesList) {
        return [SELECT Main_boutique__r.Name, Main_boutique__c, OwnerId, Owner.LastName, Owner.FirstName, COUNT(Id) accountCount 
                FROM Account 
                WHERE Main_boutique__c IN :storesList  
                GROUP BY Main_boutique__c, Main_boutique__r.Name, OwnerId, Owner.LastName, Owner.FirstName];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(List<String> listOwners) {
        return [SELECT Name, Segment__c, OwnerId, Owner.LastName, Owner.FirstName, Main_boutique__r.Name , Main_boutique__r.Country__r.Name,  Main_boutique__c 
                FROM Account
                WHERE OwnerId IN :listOwners];
    }
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getSellers(List<String> sellerList) {
        return [SELECT Main_boutique__r.Name, Main_boutique__c, OwnerId, Owner.LastName, Owner.FirstName, COUNT(Id) accountCount 
                FROM Account 
                WHERE Main_boutique__c IN :sellerList 
                GROUP BY Main_boutique__c, Main_boutique__r.Name, OwnerId, Owner.LastName, Owner.FirstName];
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getCountryNames(List<Id> countryIds) {
        List<Country__c> countries = [SELECT Name FROM Country__c WHERE Id IN :countryIds];
        List<String> countryNames = new List<String>();
        for (Country__c country : countries) {
            countryNames.add(country.Name);
        }
        return countryNames;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getStoreNames(List<Id> storeIds) {
        List<Store__c> stores = [SELECT Name FROM Store__c WHERE Id IN :storeIds];
        List<String> storeNames = new List<String>();
        for (Store__c store : stores) {
            storeNames.add(store.Name);
        }
        return storeNames;
    }

}