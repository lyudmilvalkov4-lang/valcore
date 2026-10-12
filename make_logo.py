from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


SCALE = 4
W, H = 320, 260


def p(x, y):
    return int(x * SCALE), int(y * SCALE)


def main():
    Path("assets").mkdir(exist_ok=True)
    canvas = Image.new("RGBA", (W * SCALE, H * SCALE), (0, 0, 0, 0))

    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    body = [
        p(67, 222), p(112, 20), p(233, 20), p(267, 24), p(292, 35),
        p(310, 56), p(319, 84), p(319, 121), p(310, 154), p(292, 181),
        p(265, 202), p(232, 215), p(204, 219), p(140, 219),
        p(113, 302), p(31, 302)
    ]
    sd.polygon([(x, y + 8 * SCALE) for x, y in body], fill=(6, 40, 79, 65))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(5 * SCALE)))

    draw = ImageDraw.Draw(canvas)
    side = [
        p(53, 232), p(98, 30), p(219, 30), p(253, 34), p(278, 45),
        p(296, 66), p(305, 94), p(305, 131), p(296, 164), p(278, 191),
        p(251, 212), p(218, 225), p(190, 229), p(126, 229),
        p(99, 312), p(17, 312)
    ]
    draw.polygon(side, fill=(25, 78, 159, 255))

    draw.polygon(body, fill=(53, 127, 232, 255))
    draw.polygon([p(67, 222), p(112, 20), p(233, 20), p(267, 24), p(292, 35),
                  p(310, 56), p(319, 84), p(319, 121), p(310, 154), p(292, 181),
                  p(265, 202), p(232, 215), p(204, 219), p(140, 219),
                  p(113, 302), p(31, 302)], fill=(49, 126, 233, 255))
    draw.polygon([p(112, 20), p(233, 20), p(267, 24), p(292, 35), p(310, 56),
                  p(319, 84), p(319, 98), p(105, 58)], fill=(105, 173, 255, 190))

    white = (255, 255, 255, 255)
    blue = (51, 127, 233, 255)
    draw.line([p(68, 205), p(109, 48), p(238, 48)], fill=white, width=24 * SCALE, joint="curve")
    draw.arc([p(208, 48), p(336, 190)], 270, 92, fill=white, width=24 * SCALE)
    draw.line([p(272, 205), p(119, 205), p(88, 308)], fill=white, width=24 * SCALE, joint="curve")
    draw.line([p(145, 88), p(238, 88)], fill=blue, width=24 * SCALE)
    draw.arc([p(208, 88), p(288, 158)], 270, 91, fill=blue, width=24 * SCALE)
    draw.line([p(246, 158), p(133, 158)], fill=blue, width=24 * SCALE)

    draw.line([p(125, 160), p(195, 160)], fill=white, width=18 * SCALE)
    draw.arc([p(181, 160), p(246, 222)], 270, 96, fill=white, width=18 * SCALE)
    draw.line([p(213, 222), p(117, 222)], fill=white, width=18 * SCALE)
    draw.line([p(139, 184), p(200, 184)], fill=blue, width=18 * SCALE)
    draw.arc([p(184, 184), p(228, 210)], 270, 90, fill=blue, width=18 * SCALE)
    draw.line([p(206, 210), p(132, 210)], fill=blue, width=18 * SCALE)

    bbox = canvas.getbbox()
    canvas.crop(bbox).save("assets/valkov-logo-web.png")


if __name__ == "__main__":
    main()
