/**
 * Alex AI After Effects Project Generator
 * ExtendScript for automated Lottie animation creation
 * 
 * This script creates standardized After Effects projects for Alex AI components
 * with consistent naming, structure, and export settings for Lottie animations.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

var ALEX_AI_CONFIG = {
    // Project settings
    projectName: "AlexAI_Animations",
    compWidth: 1920,
    compHeight: 1080,
    compFrameRate: 60,
    compDuration: 3.0, // seconds
    
    // Color palette (matching our design system)
    colors: {
        primary: [0.2, 0.8, 1.0, 1.0],        // #33CCFF - Electric Blue
        secondary: [0.8, 0.2, 1.0, 1.0],      // #CC33FF - Purple
        accent: [1.0, 0.6, 0.0, 1.0],         // #FF9900 - Orange
        success: [0.2, 1.0, 0.4, 1.0],        // #33FF66 - Green
        warning: [1.0, 0.8, 0.0, 1.0],        // #FFCC00 - Yellow
        error: [1.0, 0.2, 0.4, 1.0],          // #FF3366 - Red
        background: [0.05, 0.05, 0.05, 1.0],  // #0D0D0D - Dark
        surface: [0.15, 0.15, 0.15, 1.0],     // #262626 - Surface
        text: [0.95, 0.95, 0.95, 1.0]         // #F2F2F2 - Light Text
    },
    
    // Animation presets
    presets: {
        cta: {
            name: "CTA_Button",
            duration: 2.0,
            easing: "easeOutCubic"
        },
        loading: {
            name: "Loading_Spinner",
            duration: 1.5,
            easing: "easeInOutCubic"
        },
        success: {
            name: "Success_Checkmark",
            duration: 1.0,
            easing: "easeOutBack"
        },
        error: {
            name: "Error_X",
            duration: 1.0,
            easing: "easeOutBounce"
        },
        hover: {
            name: "Hover_Effect",
            duration: 0.3,
            easing: "easeOutCubic"
        },
        scroll: {
            name: "Scroll_Indicator",
            duration: 2.0,
            easing: "easeInOutSine"
        }
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function createColor(colorArray) {
    return new RGBColor();
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

// ============================================================================
// ANIMATION CREATION FUNCTIONS
// ============================================================================

function createCTAButton() {
    var preset = ALEX_AI_CONFIG.presets.cta;
    var comp = app.project.items.addComp(preset.name, ALEX_AI_CONFIG.compWidth, ALEX_AI_CONFIG.compHeight, 1.0, preset.duration, ALEX_AI_CONFIG.compFrameRate);
    
    // Create button background
    var button = createSolid("Button_BG", ALEX_AI_CONFIG.colors.primary, 300, 80);
    button.property("Position").setValue([960, 540]);
    button.property("Anchor Point").setValue([150, 40]);
    
    // Create button text
    var text = createText("JOIN NOW", 24, ALEX_AI_CONFIG.colors.text);
    text.property("Position").setValue([960, 540]);
    text.property("Anchor Point").setValue([0, 0]);
    
    // Animate button scale on hover
    var scale = button.property("Scale");
    setKeyframe(scale, 0, [100, 100], [0, 0]);
    setKeyframe(scale, 0.5, [110, 110], [0, 0]);
    setKeyframe(scale, 1.0, [100, 100], [0, 0]);
    
    // Animate button glow
    var glow = button.property("Effects").addProperty("ADBE Glow");
    glow.property("Glow Intensity").setValue(0);
    setKeyframe(glow.property("Glow Intensity"), 0, 0, [0, 0]);
    setKeyframe(glow.property("Glow Intensity"), 0.5, 50, [0, 0]);
    setKeyframe(glow.property("Glow Intensity"), 1.0, 0, [0, 0]);
    
    return comp;
}

function createLoadingSpinner() {
    var preset = ALEX_AI_CONFIG.presets.loading;
    var comp = app.project.items.addComp(preset.name, 200, 200, 1.0, preset.duration, ALEX_AI_CONFIG.compFrameRate);
    
    // Create spinner circle
    var circle = createSolid("Spinner_Circle", ALEX_AI_CONFIG.colors.primary, 200, 200);
    circle.property("Position").setValue([100, 100]);
    circle.property("Anchor Point").setValue([100, 100]);
    
    // Add stroke effect
    var stroke = circle.property("Effects").addProperty("ADBE Stroke");
    stroke.property("Stroke Width").setValue(8);
    stroke.property("Stroke Color").setValue(createColor(ALEX_AI_CONFIG.colors.primary));
    stroke.property("Paint Style").setValue(2); // On Transparent
    
    // Create mask for spinner effect
    var mask = circle.property("Masks").addProperty("Mask");
    mask.property("Mask Path").setValue([
        {x: 100, y: 20},
        {x: 100, y: 20},
        {x: 100, y: 20},
        {x: 100, y: 20}
    ]);
    
    // Animate rotation
    var rotation = circle.property("Rotation");
    setKeyframe(rotation, 0, 0, [0, 0]);
    setKeyframe(rotation, preset.duration, 360, [0, 0]);
    
    return comp;
}

function createSuccessCheckmark() {
    var preset = ALEX_AI_CONFIG.presets.success;
    var comp = app.project.items.addComp(preset.name, 200, 200, 1.0, preset.duration, ALEX_AI_CONFIG.compFrameRate);
    
    // Create checkmark using shape layer
    var shape = comp.layers.addShape();
    shape.name = "Checkmark";
    
    // Add path for checkmark
    var path = shape.property("Contents").addProperty("ADBE Vector Shape - Group");
    var pathData = path.property("Contents").addProperty("ADBE Vector Shape - Path");
    
    // Set checkmark path
    pathData.property("Path").setValue([
        {x: 50, y: 100},
        {x: 80, y: 130},
        {x: 150, y: 60}
    ]);
    
    // Add stroke
    var stroke = shape.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue(createColor(ALEX_AI_CONFIG.colors.success));
    stroke.property("Stroke Width").setValue(12);
    
    // Animate checkmark drawing
    var trimPaths = shape.property("Contents").addProperty("ADBE Vector Filter - Trim");
    setKeyframe(trimPaths.property("End"), 0, 0, [0, 0]);
    setKeyframe(trimPaths.property("End"), 0.8, 100, [0, 0]);
    
    // Animate scale
    var scale = shape.property("Scale");
    setKeyframe(scale, 0, [0, 0], [0, 0]);
    setKeyframe(scale, 0.3, [120, 120], [0, 0]);
    setKeyframe(scale, 1.0, [100, 100], [0, 0]);
    
    return comp;
}

function createErrorX() {
    var preset = ALEX_AI_CONFIG.presets.error;
    var comp = app.project.items.addComp(preset.name, 200, 200, 1.0, preset.duration, ALEX_AI_CONFIG.compFrameRate);
    
    // Create X using two lines
    var line1 = comp.layers.addShape();
    line1.name = "Line1";
    
    var path1 = line1.property("Contents").addProperty("ADBE Vector Shape - Group");
    var pathData1 = path1.property("Contents").addProperty("ADBE Vector Shape - Path");
    pathData1.property("Path").setValue([
        {x: 50, y: 50},
        {x: 150, y: 150}
    ]);
    
    var stroke1 = line1.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke1.property("Color").setValue(createColor(ALEX_AI_CONFIG.colors.error));
    stroke1.property("Stroke Width").setValue(12);
    
    var line2 = comp.layers.addShape();
    line2.name = "Line2";
    
    var path2 = line2.property("Contents").addProperty("ADBE Vector Shape - Group");
    var pathData2 = path2.property("Contents").addProperty("ADBE Vector Shape - Path");
    pathData2.property("Path").setValue([
        {x: 150, y: 50},
        {x: 50, y: 150}
    ]);
    
    var stroke2 = line2.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke2.property("Color").setValue(createColor(ALEX_AI_CONFIG.colors.error));
    stroke2.property("Stroke Width").setValue(12);
    
    // Animate X appearance
    var trimPaths1 = line1.property("Contents").addProperty("ADBE Vector Filter - Trim");
    var trimPaths2 = line2.property("Contents").addProperty("ADBE Vector Filter - Trim");
    
    setKeyframe(trimPaths1.property("End"), 0, 0, [0, 0]);
    setKeyframe(trimPaths1.property("End"), 0.5, 100, [0, 0]);
    setKeyframe(trimPaths2.property("End"), 0, 0, [0, 0]);
    setKeyframe(trimPaths2.property("End"), 0.5, 100, [0, 0]);
    
    // Animate shake effect
    var position1 = line1.property("Position");
    var position2 = line2.property("Position");
    
    for (var i = 0; i < 10; i++) {
        var time = 0.5 + (i * 0.05);
        var shake = Math.random() * 10 - 5;
        setKeyframe(position1, time, [100 + shake, 100 + shake], [0, 0]);
        setKeyframe(position2, time, [100 + shake, 100 + shake], [0, 0]);
    }
    
    return comp;
}

function createHoverEffect() {
    var preset = ALEX_AI_CONFIG.presets.hover;
    var comp = app.project.items.addComp(preset.name, 300, 200, 1.0, preset.duration, ALEX_AI_CONFIG.compFrameRate);
    
    // Create hover target
    var target = createSolid("Hover_Target", ALEX_AI_CONFIG.colors.surface, 300, 200);
    target.property("Position").setValue([150, 100]);
    target.property("Anchor Point").setValue([150, 100]);
    
    // Create hover indicator
    var indicator = createSolid("Hover_Indicator", ALEX_AI_CONFIG.colors.accent, 20, 20);
    indicator.property("Position").setValue([150, 100]);
    indicator.property("Anchor Point").setValue([10, 10]);
    
    // Animate indicator movement
    var position = indicator.property("Position");
    setKeyframe(position, 0, [150, 100], [0, 0]);
    setKeyframe(position, 0.5, [200, 80], [0, 0]);
    setKeyframe(position, 1.0, [150, 100], [0, 0]);
    
    // Animate scale
    var scale = indicator.property("Scale");
    setKeyframe(scale, 0, [100, 100], [0, 0]);
    setKeyframe(scale, 0.5, [150, 150], [0, 0]);
    setKeyframe(scale, 1.0, [100, 100], [0, 0]);
    
    return comp;
}

function createScrollIndicator() {
    var preset = ALEX_AI_CONFIG.presets.scroll;
    var comp = app.project.items.addComp(preset.name, 100, 200, 1.0, preset.duration, ALEX_AI_CONFIG.compFrameRate);
    
    // Create scroll track
    var track = createSolid("Scroll_Track", ALEX_AI_CONFIG.colors.surface, 100, 200);
    track.property("Position").setValue([50, 100]);
    track.property("Anchor Point").setValue([50, 100]);
    
    // Create scroll thumb
    var thumb = createSolid("Scroll_Thumb", ALEX_AI_CONFIG.colors.primary, 80, 40);
    thumb.property("Position").setValue([50, 50]);
    thumb.property("Anchor Point").setValue([40, 20]);
    
    // Animate scroll movement
    var position = thumb.property("Position");
    setKeyframe(position, 0, [50, 50], [0, 0]);
    setKeyframe(position, 0.5, [50, 150], [0, 0]);
    setKeyframe(position, 1.0, [50, 50], [0, 0]);
    
    // Animate opacity
    var opacity = thumb.property("Opacity");
    setKeyframe(opacity, 0, 100, [0, 0]);
    setKeyframe(opacity, 0.25, 50, [0, 0]);
    setKeyframe(opacity, 0.75, 50, [0, 0]);
    setKeyframe(opacity, 1.0, 100, [0, 0]);
    
    return comp;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
    try {
        // Create new project
        app.newProject();
        app.project.name = ALEX_AI_CONFIG.projectName;
        
        // Create all animation components
        var animations = [
            createCTAButton(),
            createLoadingSpinner(),
            createSuccessCheckmark(),
            createErrorX(),
            createHoverEffect(),
            createScrollIndicator()
        ];
        
        // Organize in folder
        var folder = app.project.items.addFolder("AlexAI_Animations");
        for (var i = 0; i < animations.length; i++) {
            animations[i].parentFolder = folder;
        }
        
        // Save project
        var projectPath = "~/Desktop/AlexAI_Animations.aep";
        app.project.save(new File(projectPath));
        
        alert("Alex AI After Effects project created successfully!\n\n" +
              "Project saved to: " + projectPath + "\n\n" +
              "Created " + animations.length + " animation components:\n" +
              "- CTA Button\n" +
              "- Loading Spinner\n" +
              "- Success Checkmark\n" +
              "- Error X\n" +
              "- Hover Effect\n" +
              "- Scroll Indicator");
              
    } catch (error) {
        alert("Error creating Alex AI project: " + error.toString());
    }
}

// Run the script
main();
