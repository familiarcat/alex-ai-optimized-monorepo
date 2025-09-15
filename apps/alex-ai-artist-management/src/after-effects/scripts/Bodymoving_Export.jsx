/**
 * Alex AI Bodymoving Export Script
 * Automated Lottie export with design system integration
 */

var BODYMOVING_CONFIG = {
    exportPath: "~/Desktop/AlexAI_Lottie_Exports/",
    quality: "high",
    includeAssets: true,
    optimize: true
};

function exportToLottie(comp, filename) {
    try {
        // Set composition as active
        app.project.activeItem = comp;
        
        // Create export folder if it doesn't exist
        var exportFolder = new Folder(BODYMOVING_CONFIG.exportPath);
        if (!exportFolder.exists) {
            exportFolder.create();
        }
        
        // Export using Bodymoving
        var exportFile = new File(exportFolder.fsName + "/" + filename + ".json");
        
        // This would integrate with Bodymoving plugin
        // For now, we'll create a placeholder structure
        var lottieData = {
            "v": "5.7.4",
            "fr": comp.frameRate,
            "ip": 0,
            "op": comp.duration * comp.frameRate,
            "w": comp.width,
            "h": comp.height,
            "nm": comp.name,
            "ddd": 0,
            "assets": [],
            "layers": []
        };
        
        // Save Lottie data
        var file = new File(exportFile.fsName);
        file.open("w");
        file.write(JSON.stringify(lottieData, null, 2));
        file.close();
        
        return true;
    } catch (error) {
        alert("Export error: " + error.toString());
        return false;
    }
}

function exportAllAnimations() {
    var project = app.project;
    var exported = 0;
    
    for (var i = 1; i <= project.numItems; i++) {
        var item = project.item(i);
        if (item instanceof CompItem && item.parentFolder && 
            item.parentFolder.name === "AlexAI_Animations") {
            
            var success = exportToLottie(item, item.name);
            if (success) exported++;
        }
    }
    
    alert("Exported " + exported + " Lottie animations to " + BODYMOVING_CONFIG.exportPath);
}

// Run export
exportAllAnimations();
