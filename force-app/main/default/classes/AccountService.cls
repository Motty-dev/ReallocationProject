public with sharing class AccountService {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(List<String> listOwners) {
        return [SELECT Id, LastName, FirstName, PersonEmail, Segment__c, OwnerId, Owner.LastName, Owner.FirstName, Main_boutique__r.Name  
                FROM Account
                WHERE OwnerId IN :listOwners];
    }
}