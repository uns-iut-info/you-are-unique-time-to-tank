const level_map = [
    // {
    //     level: [
    //         "----------h------h-----",
    //         "----------h---B--h--B--",
    //         "----------h------h-----",
    //         "hhhhhhh---h------------",
    //         "----------h------------",
    //         "----------h--hhhhhhhhhh",
    //         "----------h-------B----",
    //         "-----------------------",
    //         "------------B--h-------",
    //         "hhhhhhhhhhh----h-------",
    //         "--P------------h---hhhh",
    //         "----------h----h-------",
    //         "----------h----h-------",
    //     ],
    //     sol: "textures/ground_diffuse.png",
    //     minHeightMap: -1,
    // },
    {
        level:
            [
                "---------------",
                "---------------",
                "--P--------N---",
                "------c--------",
                "---------------",
            ],
        sol: "textures/ground_diffuse.png",
        minHeightMap: -0.1,
    },
    {
        level:
            [
                "-----------------------",
                "-----------------------",
                "------h----------------",
                "-----------------------",
                "-----------------------",
                "--------W--W-----------",
                "-----P-----w------R----",
                "-----------w-----------",
                "--------W--W-----------",
                "-----------------------",
                "-----------------------",
                "-----------------------",
                "-----------------------",
            ],
        sol: "textures/ground_diffuse.png",
        minHeightMap: -0.1,
    },
    {
        level: [
            "-----------------------",
            "-----------------------",
            "--------------------R--",
            "----WWWWWWWWwww--------",
            "-----------------------",
            "-----------------------",
            "-----------------------",
            "-----------------------",
            "-----------------------",
            "--------wwwWWWWWWWW----",
            "-----------------------",
            "--P--------------------",
            "-----------------------",
        ],
        sol: "textures/ground.png",
        minHeightMap: -1,
    },
    {
        level: [
            "----------h------h-----",
            "----------h---B--h--B--",
            "----------h------h-----",
            "hhhhhhh---h------------",
            "----------h------------",
            "----------h--hhhhhhhhhh",
            "----------h-------B----",
            "-----------------------",
            "------------B--h-------",
            "hhhhhhhhhhh----h-------",
            "--P------------h---hhhh",
            "----------h----h-------",
            "----------h----h-------",
        ],
        sol: "textures/ground_diffuse.png",
        minHeightMap: -1,
    },
    {
        level: [
            "-----------------------",
            "-------B---------------",
            "---WWwwwwwwW-----------",
            "-----------W-----------",
            "-----------W-----------",
            "-----------W-----------",
            "-----------WW-----R----",
            "------------W----------",
            "------------W----------",
            "------------W----------",
            "--P---------WwwwwwwWW--",
            "-----------------------",
            "------------------B----",
        ],
        sol: "textures/ground_diffuse.png",
        minHeightMap: -1,
    },
    {
        level: [
            "-----------------------",
            "---WWWWW-------W----G--",
            "---W-----------W-------",
            "---W-B---------W-------",
            "---W-----------W-------",
            "---W-----------WWWWW---",
            "-----------------------",
            "-----------------------",
            "---WWWWWW----------W---",
            "--------W----------W---",
            "--P-----W----------W---",
            "--------W------WWWWW-R-",
            "-----------------------",
        ],
        sol: "textures/ground_diffuse.png",
        minHeightMap: -1,
    },
]

let current_level_dico = level_map[0]

/**
 * @param {number} lvl_number 
 */
function draw_level_map() {
    setCurrentLevelDico()
    if (level == 0) {
        char1 = new Char(ObjectEnum.Player, 0, 0, 0, 3 * speedMultUti, 800 * reloadMultUti, 40);
        selected_bonuses = []
    }
    let widthOffset = (cell_x_number - current_level.length) / 2
    let heightOffset = (cell_y_number - current_level[0].length) / 2
    for (var [l_index, line] of current_level.entries()) {
        for (var [ch_index, ch] of line.split('').entries()) {
            var posX = (ch_index + 1) * cell_size + widthOffset;
            var posY = (current_level.length - l_index) * cell_size + heightOffset;
            switch (ch) {
                case '-':
                    break;
                case 'N':
                    var char = new Char(ObjectEnum.CharRed, posX, posY, 0, 0, 0, 0);
                    charsAI.push(char);
                    char.setStrategy(new noStrategy(char))
                    chars.push(char);

                    char.applyStrategy()
                    break;
                case 'R':
                    var char = new Char(ObjectEnum.CharRed, posX, posY, 0, 3, 2000, 40);
                    charsAI.push(char);
                    char.setStrategy(new guaranteedAI(char))
                    chars.push(char);

                    char.applyStrategy()
                    break;
                case 'B':
                    var char = new Char(ObjectEnum.CharBlue, posX, posY, 0, 3, 10000, 20);
                    charsAI.push(char);
                    chars.push(char);
                    char.setStrategy(new guaranteedAI(char))
                    char.applyStrategy()
                    break;
                case 'G':
                    var char = new Char(ObjectEnum.CharGreen, posX, posY, 0, 3, 4000, 10);
                    charsAI.push(char);
                    chars.push(char);
                    char.setStrategy(new guaranteedAI(char))
                    char.applyStrategy()
                    break;
                case 'W':
                    walls.push(new Wall(posX, posY, false));
                    break;
                case 'w':
                    walls.push(new Wall(posX, posY, true));
                    break;
                case 'c':
                    bonuses.push(new Bonus(posX, posY));
                    break;
                case 'P':
                    char1.shape.position = new BABYLON.Vector3(-width / 2 + posX, Char.height / 2, -height / 2 + posY)
                    // char1 = new Char(ObjectEnum.Player, posX, posY, 0, 3 * speedMultUti, 800 * reloadMultUti, 40);
                    chars.push(char1);
                    // camera.target = char1.getTurretTank();
                    char1.shape.rotate(BABYLON.Axis.Y, Math.PI / 2)
                    // camera.alpha -= Math.PI / 2
                    break;
                case 'h':
                    holes.push(new Hole(posX, posY))
                    break;
            }
        }
    }

    tanksAIReady = true;

    // Creation de l'enceinte 
    walls.push(new WallPerimeter(-width / 2, 0.5, 1, height + 2))
    walls.push(new WallPerimeter(width / 2 + 1, 0.5, 1, height + 2))
    walls.push(new WallPerimeter(0.5, height / 2 + 1, width, 1))
    walls.push(new WallPerimeter(0.5, -height / 2, width, 1))

}

function setCurrentLevelDico() {
    current_level_dico = level_map[level]
    current_level = current_level_dico.level;
    cell_x_number = current_level_dico.level.length;
    cell_y_number = current_level_dico.level[0].length;

    height = cell_x_number * cell_size;
    width = cell_y_number * cell_size;
}