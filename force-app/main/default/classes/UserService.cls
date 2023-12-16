public with sharing class UserService {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOwners(List<String> storesList) {
        return [SELECT Main_boutique__c, OwnerId, Owner.LastName, Owner.FirstName, COUNT(Id) accountCount 
                FROM Account 
                WHERE Main_boutique__c IN :storesList  
                GROUP BY Main_boutique__c, OwnerId, Owner.LastName, Owner.FirstName];
    }
}