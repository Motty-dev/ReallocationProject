public with sharing class CountryService {
    @AuraEnabled(cacheable=true)
    public static List<Country__c> getCountries() {
        return [SELECT Id, Name FROM Country__c ORDER BY Name];
    }
}
