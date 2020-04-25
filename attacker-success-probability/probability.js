(function() {
    function attackerSuccessProbability(q, n) {
        var p = 1.0 - q;
        var lambda = n * (q / p);
        var sum = 1.0;
        var i, k;
        for (k = 0; k <= n; k++) {
            var poisson = Math.exp(-lambda);
            for (i = 1; i <= k; i++) {
                poisson *= lambda / i;
            }
            sum -= poisson * (1 - Math.pow(q / p, n - k));
        }
        return sum;
    }

    function isNumber(x){ 
        if( typeof(x) != 'number' && typeof(x) != 'string' ) {
            return false;
        } else  {
            return (x == parseFloat(x) && isFinite(x));
        }
    }

    function displayProbability() {
        var q = $('#q').val();
        var n = $('#n').val();

        if (isNumber(q) && isNumber(n)) {
            if (q < 0.5) {
                $('#pn').val(attackerSuccessProbability(q, n, false));
            } else {
                $('#pn').val(1);
            }
        }
    }

    function displayProbabilityOnChange() {
        $('#q').bind('change', displayProbability);
        $('#n').bind('change', displayProbability);
    }

    function drawGraph(param) {
        nv.addGraph(function() {
            var chart = nv.models.lineChart()
            .useInteractiveGuideline(true)
            .showLegend(true)
            .showYAxis(true)
            .showXAxis(true);

            chart.xAxis
            .axisLabel(param.xLabel)
            .tickFormat(d3.format(param.xFormat));

            chart.yAxis
            .axisLabel(param.yLabel)
            .tickFormat(d3.format(param.yFormat));

            d3.select(param.svg)
            .datum(param.data)
            .transition().duration(350)
            .call(chart);

            nv.utils.windowResize(function() { chart.update() });
            return chart;
        });
    }

    function probabilityValue(probability) {
        var values = [];
        for (var i = 0; i < 50; i++) {
            values.push({x: i, y: attackerSuccessProbability(probability, i)});
        }
        return values;
    }

    function probabilityChartData() {
        return [{
            values: probabilityValue(0.2),
            key: 'q = 0.2',
            color: '#12b3c7'
        },
        {
            values: probabilityValue(0.3),
            key: 'q = 0.3',
            color: '#d74c77'
        },
        {
            values: probabilityValue(0.4),
            key: 'q = 0.4',
            color: '#ff7f0e'
        }];
    }

    function numberOfBlocksData() {
        var block_min = [];
        var limit = 0.001;
        var blockNum;
        var probability;
        var i;

        for (i = 0.1; i < 0.47; i = i + 0.01) {
            blockNum = 0;
            probability = 1;
            while (probability > limit) {
                blockNum++;
                probability = attackerSuccessProbability(i, blockNum);
            }
            block_min.push({x: i, y: blockNum});
        }

        return [{
            values: block_min,
            key: 'p(n) < 0.001',
            color: '#12b3c7'
        }];
    }

    displayProbabilityOnChange();

    drawGraph({
        svg: '#chart1 svg',
        xLabel: 'Number of blocks: n',
        xFormat: ',r',
        yLabel: 'Probability: p(n)',
        yFormat: ',.2f',
        data: probabilityChartData()
    });

    drawGraph({
        svg: '#chart2 svg',
        xLabel: 'Probability: q',
        xFormat: ',.2f',
        yLabel: 'Number of blocks: n',
        yFormat: ',r',
        data: numberOfBlocksData()
    });
})();
