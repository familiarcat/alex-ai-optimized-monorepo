
function stressTestFunction() {
    const timestamp = new Date().toISOString();
    console.log(`Stress test function called at ${timestamp}`);
    return { status: 'success', timestamp };
}

module.exports = { stressTestFunction };
