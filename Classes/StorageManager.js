class StorageManager {

    static updateStorage() {
        localStorage.mineception = JSON.stringify({
            customizations: customizations
        });
    }
}