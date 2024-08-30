class Customizations {

    static menu = document.querySelector('#customizationsMenu');

    static toggleMenu() {
        if(Customizations.menu.dataset.active == 'false') {
            Customizations.menu.dataset.active = 'true';
            Customizations.menu.fadeIn(200, 'flex');
        } else {
            Customizations.menu.dataset.active = 'false';
            Customizations.menu.fadeOut(200, false);
        }
    }

    static updateInputs() {
        let outerRows = document.querySelector('#customizationsMenu #rows');
        outerRows.value = customizations.outerDimensions.y;
        outerRows.addEventListener('input', () => {
            customizations.outerDimensions.y = parseInt(outerRows.value);
            StorageManager.updateStorage();
        });
    
        let outerColumns = document.querySelector('#customizationsMenu #columns');
        outerColumns.value = customizations.outerDimensions.x;
        outerColumns.addEventListener('input', () => {
            customizations.outerDimensions.x = parseInt(outerColumns.value);
            StorageManager.updateStorage();
        });

        let outerMines = document.querySelector('#customizationsMenu #mines');
        outerMines.value = (customizations.outerDimensions.x * customizations.outerDimensions.y / customizations.outerDimensions.density).toFixed(0);

        let outerDensity = document.querySelector('#customizationsMenu #density');
        outerDensity.value = customizations.outerDimensions.density;

        outerMines.addEventListener('input', () => {
            customizations.outerDimensions.density = customizations.outerDimensions.x * customizations.outerDimensions.y / parseFloat(outerMines.value);
            outerDensity.value = customizations.outerDimensions.density
            StorageManager.updateStorage();
        });
    

        outerDensity.addEventListener('input', () => {
            customizations.outerDimensions.density = parseFloat(outerDensity.value);
            outerMines.value = (customizations.outerDimensions.x * customizations.outerDimensions.y / customizations.outerDimensions.density).toFixed(0);
            StorageManager.updateStorage();
        });
    
        let innerRows = document.querySelector('#customizationsMenu #innerRows');
        innerRows.value = customizations.innerDimensions.y;
        innerRows.addEventListener('input', () => {
            customizations.innerDimensions.y = parseInt(innerRows.value);
            StorageManager.updateStorage();
        });
    
        let innerColumns = document.querySelector('#customizationsMenu #innerColumns');
        innerColumns.value = customizations.innerDimensions.x;
        innerColumns.addEventListener('input', () => {
            customizations.innerDimensions.x = parseInt(innerColumns.value);
            StorageManager.updateStorage();
        });

        let innerMines = document.querySelector('#customizationsMenu #innerMines');
        innerMines.value = (customizations.innerDimensions.x * customizations.innerDimensions.y / customizations.innerDimensions.density).toFixed(0);

        let innerDensity = document.querySelector('#customizationsMenu #innerDensity');
        innerDensity.value = customizations.innerDimensions.density;

        innerMines.addEventListener('input', () => {
            customizations.innerDimensions.density = customizations.innerDimensions.x * customizations.innerDimensions.y / parseFloat(innerMines.value);
            innerDensity.value = customizations.innerDimensions.density;
            StorageManager.updateStorage();
        });
    
        innerDensity.addEventListener('input', () => {
            customizations.innerDimensions.density = parseInt(innerDensity.value);
            innerMines.value = (customizations.innerDimensions.x * customizations.innerDimensions.y / customizations.innerDimensions.density).toFixed(0);
            StorageManager.updateStorage();
        });

        let noFlag = document.querySelector('#customizationsMenu #noFlag');
        noFlag.checked = customizations.noFlag;

        noFlag.addEventListener('input', () => {
            customizations.noFlag = noFlag.checked;
            StorageManager.updateStorage();
        });

        let mousedown = document.querySelector('#customizationsMenu #clickMechanics1');
        let mouseup = document.querySelector('#customizationsMenu #clickMechanics2');
        mousedown.checked = customizations.clickMechanics == 'mousedown';
        mouseup.checked = customizations.clickMechanics == 'mouseup';

        mousedown.addEventListener('input', () => {
            customizations.clickMechanics = 'mousedown';
            StorageManager.updateStorage();
        });

        mouseup.addEventListener('input', () => {
            customizations.clickMechanics = 'mouseup';
            StorageManager.updateStorage();
        });

        let newGame = document.querySelector('#customizationsMenu #newGame');
        newGame.addEventListener('click', () => {
            createBoard(gamemode == 'mineception');
        });
    }
}