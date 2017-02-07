function visualise() {
    d3.json('london-9.topo.json', (error, data) => {
        if (error) return console.error(error)
        var target = 'main'
        var sizeRatio = 0.8 // approximate ratio for London
        var scaleRatio = 0.001
        var width = parseInt(d3.select(target).style('width'))
        var height = Math.round(width * sizeRatio)
        var scaledWidth = width * scaleRatio
        var scaledHeight = height * scaleRatio
        d3.select(target).select('svg').remove()
        var graphic = d3
            .select(target)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
        var boroughs = topojson.feature(data, data.objects.boroughs).features
        graphic
            .append('g')
            .attr('transform', 'scale(' + scaledWidth + '),translate(' + (scaledWidth / 2) + ',' + (scaledHeight / 2) + ')')
            .selectAll('borough')
            .data(boroughs)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .on('mouseover', (borough, i, elements) => {
                d3.select(elements[i]).classed('selected', true)
            })
            .on('mouseout', (borough, i, elements) => {
                d3.select(elements[i]).classed('selected', false)
            })
            .on('click', borough => {
                var text = borough.properties.name + ': £' + parseInt(borough.properties.incomeMedian).toLocaleString()
                document.querySelector('h2').innerHTML = text
            })
    })
}

window.addEventListener('load', visualise)
window.addEventListener('resize', visualise)
