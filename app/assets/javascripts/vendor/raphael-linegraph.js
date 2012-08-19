Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
    color = color || "#000";
    var path = ["M", Math.round(x), Math.round(y) - .5, "L", Math.round(x + w), Math.round(y) - .5];
    path = path.concat(["M", Math.round(x), Math.round(y+h) - .5, "L", Math.round(x + w), Math.round(y+h) - .5]);
    // var path = ["M", Math.round(x), Math.round(y) - .5, "L", Math.round(x + w), Math.round(y) - .5, Math.round(x + w), Math.round(y + h) - .5, Math.round(x), Math.round(y + h) - .5];
    var rowHeight = h / hv,
        columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
        path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
    }
    for (i = 1; i < wv; i++) {
        // path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
    }
    return this.path(path.join(",")).attr({stroke: color});
};


var renderLineGraph = function (labels, data) {
    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }
    
    var incrementsOf = 10;
    var spaceOnEitherSideOfLineGraph = 16;
    // Draw
    var width = 900,
        height = 250,
        leftgutter = 30,
        bottomgutter = 20,
        topgutter = 20,
        colorhue = .6 || Math.random(),
        color = "hsl(" + [colorhue, .5, .5] + ")",
        r = Raphael("simpleExample", width, height),
        txt = {font: '12px Helvetica Neue, Arial', fill: "#fff"},
        txt1 = {font: '10px Helvetica Neue, Arial', fill: "#fff"},
        txt2 = {font: '12px Helvetica Neue, Arial', fill: "#666"},
        X = ((width - leftgutter) / labels.length) - spaceOnEitherSideOfLineGraph,
        max = Math.max.apply(Math, data),
        nextIncrimentPastMax = (Math.round(parseInt(max)/incrementsOf)*incrementsOf),
        Y = (height - bottomgutter - topgutter) / nextIncrimentPastMax;

        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dev'];

    r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, null, (nextIncrimentPastMax/incrementsOf), "#CCC");
    var path = r.path().attr({stroke: color, "stroke-width": 4, "stroke-linejoin": "round"}),
        bgp = r.path().attr({stroke: "none", opacity: .3, fill: color}),
        label = r.set(),
        lx = 0, ly = 0,
        is_label_visible = false,
        leave_timer,
        blanket = r.set();
    label.push(r.text(60, 12, "xxxxxxxxxxxxxx").attr(txt));
    label.push(r.text(60, 27, "xxxxxxxxxxxxxx").attr(txt1).attr({fill: color}));
    label.hide();
    var frame = r.popup(100, 100, label, "right").attr({fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .9}).hide();

    // y axis labels
    var maxyval = data[0];
    var yvalcount = 0;
    for (var i = 0; i < maxyval; i+=incrementsOf) {
        console.log(Y);
        r.text(Math.round(leftgutter + 40), Math.round(height - bottomgutter - Y * i), i).attr(txt2).toBack();
        yvalcount += 1;
    }
    r.text(Math.round(leftgutter + 40), Math.round(height - bottomgutter - Y * nextIncrimentPastMax), nextIncrimentPastMax).attr(txt2).toBack();

    var p=[], bgpp;
    for (var i = 0, ii = labels.length; i < ii; i++) {
        var y = Math.round(height - bottomgutter - Y * data[i]),
            x = Math.round(leftgutter + X * (i + .5)) + (spaceOnEitherSideOfLineGraph * 3),
            t = r.text(x, height - 9, months[labels[i].getMonth()] + ' ' + labels[i].getDate()).attr(txt2).toBack();

        
        p = p.concat([i ? "L" : "M", x, y]);
        if (!i) {
            // p = ["M", x, y, "C", x, y];
            // bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
        }

        if (i && i < ii - 1) {
            // var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
            //     X0 = Math.round(leftgutter + X * (i - .5)),
            //     Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
            //     X2 = Math.round(leftgutter + X * (i + 1.5));
            // var a = getAnchors(X0, Y0, x, y, X2, Y2);
        //     p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            // bgpp = bgpp.concat([i ? "L" : "M", x, y]);
        }
        var dot = r.circle(x, y, 4).attr({fill: color, stroke: color, "stroke-width": 2});
        blanket.push(r.rect(x - (spaceOnEitherSideOfLineGraph * 3), 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
        var rect = blanket[blanket.length - 1];
        (function (x, y, data, lbl, dot) {
            var timer, i = 0;
            rect.hover(function () {
                clearTimeout(leave_timer);
                var side = "right";
                if (x + frame.getBBox().width > width) {
                    side = "left";
                }
                var ppp = r.popup(x, y, label, side, 1),
                    anim = Raphael.animation({
                        path: ppp.path,
                        transform: ["t", ppp.dx, ppp.dy]
                    }, 200 * is_label_visible);
                lx = label[0].transform()[0][1] + ppp.dx;
                ly = label[0].transform()[0][2] + ppp.dy;
                frame.show().stop().animate(anim);
                label[0].attr({text: data + " point" + (data == 1 ? "" : "s")}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
                label[1].attr({text: lbl.toDateString()}).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
                dot.attr("r", 6);
                is_label_visible = true;
            }, function () {
                dot.attr("r", 4);
                leave_timer = setTimeout(function () {
                    frame.hide();
                    label[0].hide();
                    label[1].hide();
                    is_label_visible = false;
                }, 1);
            });
        })(x, y, data[i], labels[i], dot);
    }
    // p = p.concat([x, y, x, y]);
    // bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
    path.attr({path: p});
    // bgp.attr({path: bgpp});
    frame.toFront();
    label[0].toFront();
    label[1].toFront();
    blanket.toFront();
};