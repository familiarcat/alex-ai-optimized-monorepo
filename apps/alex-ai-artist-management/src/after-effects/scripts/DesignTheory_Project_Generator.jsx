/**
 * Alex AI Design Theory After Effects Project Generator
 * Creates Carson/Brockmann specific animations based on design theory analysis
 */

// ============================================================================
// DESIGN THEORY CONFIGURATIONS
// ============================================================================

var DESIGN_THEORY_CONFIG = {
    carson: {
        name: "Carson_Experimental_Animations",
        characteristics: {
            experimental: true,
            deconstructive: true,
            chaotic: true,
            bold: true,
            unconventional: true
        },
        animationStyles: {
            timing: "chaotic",
            easing: "experimental",
            intensity: "high",
            randomness: 0.3,
            glitchEffects: true,
            distortion: true
        },
        colors: {
            primary: [1.0, 0.4, 0.2, 1.0],        // #FF6633 - Bold Orange
            secondary: [0.2, 1.0, 0.8, 1.0],      // #33FFCC - Electric Cyan
            accent: [1.0, 0.2, 0.8, 1.0],         // #FF33CC - Hot Pink
            background: [0.05, 0.05, 0.05, 1.0],  // #0D0D0D - Deep Black
            text: [1.0, 1.0, 1.0, 1.0]           // #FFFFFF - Pure White
        }
    },
    brockmann: {
        name: "Brockmann_Systematic_Animations",
        characteristics: {
            systematic: true,
            gridBased: true,
            minimal: true,
            functional: true,
            precise: true
        },
        animationStyles: {
            timing: "precise",
            easing: "systematic",
            intensity: "low",
            randomness: 0.0,
            glitchEffects: false,
            distortion: false
        },
        colors: {
            primary: [0.0, 0.5, 1.0, 1.0],        // #0080FF - Systematic Blue
            secondary: [0.2, 0.2, 0.2, 1.0],      // #333333 - Dark Gray
            accent: [1.0, 1.0, 1.0, 1.0],         // #FFFFFF - Clean White
            background: [0.95, 0.95, 0.95, 1.0],  // #F2F2F2 - Light Gray
            text: [0.1, 0.1, 0.1, 1.0]           // #1A1A1A - Dark Text
        }
    },
    hybrid: {
        name: "Hybrid_Modern_Animations",
        characteristics: {
            balanced: true,
            modern: true,
            accessible: true,
            innovative: true
        },
        animationStyles: {
            timing: "balanced",
            easing: "smooth",
            intensity: "medium",
            randomness: 0.1,
            glitchEffects: false,
            distortion: false
        },
        colors: {
            primary: [0.2, 0.8, 1.0, 1.0],        // #33CCFF - Electric Blue
            secondary: [0.8, 0.2, 1.0, 1.0],      // #CC33FF - Purple
            accent: [1.0, 0.6, 0.0, 1.0],         // #FF9900 - Orange
            background: [0.1, 0.1, 0.1, 1.0],     // #1A1A1A - Dark
            text: [0.9, 0.9, 0.9, 1.0]           // #E6E6E6 - Light Text
        }
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function createColor(colorArray) {
    var color = new RGBColor();
    color.red = colorArray[0] * 255;
    color.green = colorArray[1] * 255;
    color.blue = colorArray[2] * 255;
    return color;
}

function createSolid(name, color, width, height) {
    var solid = app.project.activeItem.layers.addSolid(createColor(color), name, width, height, 1.0);
    return solid;
}

function createText(text, fontSize, color) {
    var textLayer = app.project.activeItem.layers.addText(text);
    var textDoc = textLayer.property("Source Text").value;
    textDoc.fontSize = fontSize;
    textDoc.fillColor = createColor(color);
    textDoc.font = "Arial-BoldMT";
    textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
    textLayer.property("Source Text").setValue(textDoc);
    return textLayer;
}

function setKeyframe(property, time, value, interpolation) {
    property.setValueAtTime(time, value);
    if (interpolation) {
        property.setTemporalEaseAtKey(property.numKeys, interpolation, interpolation);
    }
}

function addRandomness(value, randomness) {
    return value + (Math.random() - 0.5) * randomness * value;
}

// ============================================================================
// CARSON-STYLE ANIMATIONS
// ============================================================================

function createCarsonCTAButton(config) {
    var comp = app.project.items.addComp("Carson_CTA_Button", 400, 120, 1.0, 3.0, 60);
    
    // Create chaotic background
    var background = createSolid("Chaotic_BG", config.colors.background, 400, 120);
    background.property("Position").setValue([200, 60]);
    
    // Add glitch effect
    var glitch = background.property("Effects").addProperty("ADBE Glow");
    glitch.property("Glow Intensity").setValue(0);
    setKeyframe(glitch.property("Glow Intensity"), 0, 0, [0, 0]);
    setKeyframe(glitch.property("Glow Intensity"), 0.5, 100, [0, 0]);
    setKeyframe(glitch.property("Glow Intensity"), 1.0, 0, [0, 0]);
    
    // Create experimental button shape
    var button = createSolid("Experimental_Button", config.colors.primary, 300, 80);
    button.property("Position").setValue([200, 60]);
    button.property("Anchor Point").setValue([150, 40]);
    
    // Add chaotic scale animation
    var scale = button.property("Scale");
    for (var i = 0; i < 30; i++) {
        var time = i * 0.1;
        var scaleValue = addRandomness(100, 0.2);
        setKeyframe(scale, time, [scaleValue, scaleValue], [0, 0]);
    }
    
    // Add rotation chaos
    var rotation = button.property("Rotation");
    for (var i = 0; i < 30; i++) {
        var time = i * 0.1;
        var rotationValue = addRandomness(0, 10);
        setKeyframe(rotation, time, rotationValue, [0, 0]);
    }
    
    // Create chaotic text
    var text = createText("REBEL NOW", 24, config.colors.text);
    text.property("Position").setValue([200, 60]);
    
    // Add text distortion
    var textScale = text.property("Scale");
    for (var i = 0; i < 30; i++) {
        var time = i * 0.1;
        var scaleValue = addRandomness(100, 0.3);
        setKeyframe(textScale, time, [scaleValue, scaleValue], [0, 0]);
    }
    
    return comp;
}

function createCarsonLoadingSpinner(config) {
    var comp = app.project.items.addComp("Carson_Loading_Chaos", 200, 200, 1.0, 2.0, 60);
    
    // Create multiple chaotic spinners
    for (var i = 0; i < 5; i++) {
        var spinner = createSolid("Chaotic_Spinner_" + i, config.colors.primary, 40, 40);
        spinner.property("Position").setValue([100, 100]);
        spinner.property("Anchor Point").setValue([20, 20]);
        
        // Chaotic rotation
        var rotation = spinner.property("Rotation");
        setKeyframe(rotation, 0, i * 72, [0, 0]);
        setKeyframe(rotation, 2.0, 360 + i * 72, [0, 0]);
        
        // Random scale changes
        var scale = spinner.property("Scale");
        for (var j = 0; j < 20; j++) {
            var time = j * 0.1;
            var scaleValue = addRandomness(100, 0.5);
            setKeyframe(scale, time, [scaleValue, scaleValue], [0, 0]);
        }
    }
    
    return comp;
}

// ============================================================================
// BROCKMANN-STYLE ANIMATIONS
// ============================================================================

function createBrockmannCTAButton(config) {
    var comp = app.project.items.addComp("Brockmann_CTA_Button", 300, 80, 1.0, 1.5, 60);
    
    // Create systematic background
    var background = createSolid("Systematic_BG", config.colors.background, 300, 80);
    background.property("Position").setValue([150, 40]);
    
    // Create precise button
    var button = createSolid("Precise_Button", config.colors.primary, 250, 60);
    button.property("Position").setValue([150, 40]);
    button.property("Anchor Point").setValue([125, 30]);
    
    // Systematic scale animation
    var scale = button.property("Scale");
    setKeyframe(scale, 0, [100, 100], [0, 0]);
    setKeyframe(scale, 0.3, [105, 105], [0, 0]);
    setKeyframe(scale, 0.6, [100, 100], [0, 0]);
    
    // Precise text
    var text = createText("SYSTEMATIC", 18, config.colors.text);
    text.property("Position").setValue([150, 40]);
    
    return comp;
}

function createBrockmannLoadingSpinner(config) {
    var comp = app.project.items.addComp("Brockmann_Loading_System", 100, 100, 1.0, 2.0, 60);
    
    // Create systematic spinner
    var spinner = createSolid("Systematic_Spinner", config.colors.primary, 80, 80);
    spinner.property("Position").setValue([50, 50]);
    spinner.property("Anchor Point").setValue([40, 40]);
    
    // Precise rotation
    var rotation = spinner.property("Rotation");
    setKeyframe(rotation, 0, 0, [0, 0]);
    setKeyframe(rotation, 2.0, 360, [0, 0]);
    
    // Systematic opacity changes
    var opacity = spinner.property("Opacity");
    setKeyframe(opacity, 0, 100, [0, 0]);
    setKeyframe(opacity, 1.0, 50, [0, 0]);
    setKeyframe(opacity, 2.0, 100, [0, 0]);
    
    return comp;
}

// ============================================================================
// HYBRID-STYLE ANIMATIONS
// ============================================================================

function createHybridCTAButton(config) {
    var comp = app.project.items.addComp("Hybrid_CTA_Button", 350, 100, 1.0, 2.0, 60);
    
    // Create balanced background
    var background = createSolid("Balanced_BG", config.colors.background, 350, 100);
    background.property("Position").setValue([175, 50]);
    
    // Create modern button
    var button = createSolid("Modern_Button", config.colors.primary, 300, 80);
    button.property("Position").setValue([175, 50]);
    button.property("Anchor Point").setValue([150, 40]);
    
    // Balanced scale animation
    var scale = button.property("Scale");
    setKeyframe(scale, 0, [100, 100], [0, 0]);
    setKeyframe(scale, 0.5, [110, 110], [0, 0]);
    setKeyframe(scale, 1.0, [100, 100], [0, 0]);
    
    // Modern glow effect
    var glow = button.property("Effects").addProperty("ADBE Glow");
    glow.property("Glow Intensity").setValue(0);
    setKeyframe(glow.property("Glow Intensity"), 0, 0, [0, 0]);
    setKeyframe(glow.property("Glow Intensity"), 0.5, 30, [0, 0]);
    setKeyframe(glow.property("Glow Intensity"), 1.0, 0, [0, 0]);
    
    // Balanced text
    var text = createText("MODERN", 20, config.colors.text);
    text.property("Position").setValue([175, 50]);
    
    return comp;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
    try {
        // Create new project
        app.newProject();
        app.project.name = "AlexAI_DesignTheory_Animations";
        
        var animations = [];
        
        // Generate Carson animations
        var carsonFolder = app.project.items.addFolder("Carson_Experimental");
        var carsonConfig = DESIGN_THEORY_CONFIG.carson;
        
        var carsonCTA = createCarsonCTAButton(carsonConfig);
        carsonCTA.parentFolder = carsonFolder;
        animations.push(carsonCTA);
        
        var carsonLoading = createCarsonLoadingSpinner(carsonConfig);
        carsonLoading.parentFolder = carsonFolder;
        animations.push(carsonLoading);
        
        // Generate Brockmann animations
        var brockmannFolder = app.project.items.addFolder("Brockmann_Systematic");
        var brockmannConfig = DESIGN_THEORY_CONFIG.brockmann;
        
        var brockmannCTA = createBrockmannCTAButton(brockmannConfig);
        brockmannCTA.parentFolder = brockmannFolder;
        animations.push(brockmannCTA);
        
        var brockmannLoading = createBrockmannLoadingSpinner(brockmannConfig);
        brockmannLoading.parentFolder = brockmannFolder;
        animations.push(brockmannLoading);
        
        // Generate Hybrid animations
        var hybridFolder = app.project.items.addFolder("Hybrid_Modern");
        var hybridConfig = DESIGN_THEORY_CONFIG.hybrid;
        
        var hybridCTA = createHybridCTAButton(hybridConfig);
        hybridCTA.parentFolder = hybridFolder;
        animations.push(hybridCTA);
        
        // Save project
        var projectPath = "~/Desktop/AlexAI_DesignTheory_Animations.aep";
        app.project.save(new File(projectPath));
        
        alert("Alex AI Design Theory After Effects project created successfully!\n\n" +
              "Project saved to: " + projectPath + "\n\n" +
              "Created " + animations.length + " design theory animations:\n" +
              "- Carson Experimental (Chaotic, Bold, Unconventional)\n" +
              "- Brockmann Systematic (Precise, Minimal, Functional)\n" +
              "- Hybrid Modern (Balanced, Accessible, Innovative)");
              
    } catch (error) {
        alert("Error creating Design Theory project: " + error.toString());
    }
}

// Run the script
main();
