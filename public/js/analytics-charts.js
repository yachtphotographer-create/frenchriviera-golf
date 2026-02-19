// Analytics Charts Initialization
document.addEventListener('DOMContentLoaded', function() {
    var dataEl = document.getElementById('chartData');
    if (!dataEl) return;

    var chartData;
    try {
        chartData = JSON.parse(dataEl.dataset.charts);
    } catch(e) {
        console.error('Failed to parse chart data:', e);
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    var colors = {
        primary: '#34c759',
        secondary: '#28a745',
        light: 'rgba(52, 199, 89, 0.15)',
        blue: '#2196F3',
        orange: '#FF9800',
        red: '#ff3b30',
        purple: '#9C27B0',
        teal: '#009688',
        pink: '#E91E63'
    };
    var chartColors = [colors.primary, colors.blue, colors.orange, colors.purple, colors.teal, colors.pink, colors.red, colors.secondary];

    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.color = '#374151';
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;

    // User Growth
    var el1 = document.getElementById('userGrowthChart');
    if (el1 && chartData.userGrowth && chartData.userGrowth.length > 0) {
        new Chart(el1, {
            type: 'line',
            data: {
                labels: chartData.userGrowth.map(function(d) {
                    return new Date(d.month).toLocaleDateString('en-US', {month:'short',year:'2-digit'});
                }),
                datasets: [{
                    label: 'New Users',
                    data: chartData.userGrowth.map(function(d) { return parseInt(d.count); }),
                    borderColor: colors.primary,
                    backgroundColor: colors.light,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // Games Per Week
    var el2 = document.getElementById('gamesWeekChart');
    if (el2 && chartData.gamesPerWeek && chartData.gamesPerWeek.length > 0) {
        new Chart(el2, {
            type: 'bar',
            data: {
                labels: chartData.gamesPerWeek.map(function(d) {
                    return new Date(d.week).toLocaleDateString('en-US', {month:'short',day:'numeric'});
                }),
                datasets: [{
                    label: 'Games',
                    data: chartData.gamesPerWeek.map(function(d) { return parseInt(d.count); }),
                    backgroundColor: colors.blue,
                    borderRadius: 4
                }]
            },
            options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // Gender
    var el3 = document.getElementById('genderChart');
    if (el3 && chartData.genderDist && chartData.genderDist.length > 0) {
        var genderLabels = {'male':'Male','female':'Female','other':'Other','not_specified':'Not Specified'};
        new Chart(el3, {
            type: 'doughnut',
            data: {
                labels: chartData.genderDist.map(function(d) { return genderLabels[d.gender] || d.gender || 'Not Specified'; }),
                datasets: [{
                    data: chartData.genderDist.map(function(d) { return parseInt(d.count); }),
                    backgroundColor: [colors.blue, colors.pink, colors.purple, '#E0E0E0']
                }]
            },
            options: { plugins: { legend: { position: 'bottom' } } }
        });
    }

    // Age
    var el4 = document.getElementById('ageChart');
    if (el4 && chartData.ageDist && chartData.ageDist.length > 0) {
        new Chart(el4, {
            type: 'bar',
            data: {
                labels: chartData.ageDist.map(function(d) { return d.age_group; }),
                datasets: [{
                    label: 'Users',
                    data: chartData.ageDist.map(function(d) { return parseInt(d.count); }),
                    backgroundColor: colors.teal,
                    borderRadius: 4
                }]
            },
            options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // Nationality
    var el5 = document.getElementById('nationalityChart');
    if (el5 && chartData.nationalityDist && chartData.nationalityDist.length > 0) {
        new Chart(el5, {
            type: 'bar',
            data: {
                labels: chartData.nationalityDist.map(function(d) { return d.nationality || 'Not Specified'; }),
                datasets: [{
                    label: 'Users',
                    data: chartData.nationalityDist.map(function(d) { return parseInt(d.count); }),
                    backgroundColor: colors.orange,
                    borderRadius: 4
                }]
            },
            options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } }
        });
    }

    // Level
    var el6 = document.getElementById('levelChart');
    if (el6 && chartData.levelDist && chartData.levelDist.length > 0) {
        var levelLabels = {'beginner':'Beginner','intermediate':'Intermediate','advanced':'Advanced','scratch':'Scratch','not_specified':'Not Specified'};
        new Chart(el6, {
            type: 'doughnut',
            data: {
                labels: chartData.levelDist.map(function(d) { return levelLabels[d.level] || d.level || 'Not Specified'; }),
                datasets: [{
                    data: chartData.levelDist.map(function(d) { return parseInt(d.count); }),
                    backgroundColor: chartColors
                }]
            },
            options: { plugins: { legend: { position: 'bottom' } } }
        });
    }

    // Handicap
    var el7 = document.getElementById('handicapChart');
    if (el7 && chartData.handicapDist && chartData.handicapDist.length > 0) {
        new Chart(el7, {
            type: 'bar',
            data: {
                labels: chartData.handicapDist.map(function(d) { return d.range; }),
                datasets: [{
                    label: 'Users',
                    data: chartData.handicapDist.map(function(d) { return parseInt(d.count); }),
                    backgroundColor: colors.primary,
                    borderRadius: 4
                }]
            },
            options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // Game Status
    var el8 = document.getElementById('gameStatusChart');
    if (el8 && chartData.gameStatus && chartData.gameStatus.length > 0) {
        var statusColors = {'open':'#34c759','full':'#FF9800','confirmed':'#2196F3','completed':'#28a745','cancelled':'#ff3b30'};
        new Chart(el8, {
            type: 'doughnut',
            data: {
                labels: chartData.gameStatus.map(function(d) { return d.status.charAt(0).toUpperCase() + d.status.slice(1); }),
                datasets: [{
                    data: chartData.gameStatus.map(function(d) { return parseInt(d.count); }),
                    backgroundColor: chartData.gameStatus.map(function(d) { return statusColors[d.status] || '#999'; })
                }]
            },
            options: { plugins: { legend: { position: 'bottom' } } }
        });
    }

    // Popular Courses
    var el9 = document.getElementById('coursesChart');
    if (el9 && chartData.popularCourses && chartData.popularCourses.length > 0) {
        new Chart(el9, {
            type: 'bar',
            data: {
                labels: chartData.popularCourses.map(function(d) { return d.name.length > 20 ? d.name.substring(0,20) + '...' : d.name; }),
                datasets: [{
                    label: 'Games',
                    data: chartData.popularCourses.map(function(d) { return parseInt(d.games_count); }),
                    backgroundColor: colors.secondary,
                    borderRadius: 4
                }]
            },
            options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } }
        });
    }
});
