function RiktigLøsning () {
    bitbot.setLedColor(0x00FF00)
    bitbot.rotatems(BBRobotDirection.Left, 100, 4000)
    Restart()
}
radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 10) {
        LøstOppgave = true
        RiktigLøsning()
    }
})
input.onButtonPressed(Button.A, function () {
    Restart()
})
function Restart () {
    LøstOppgave = false
    Sekvens = false
    bitbot.setLedColor(0xFFFF00)
}
function FeilLøsning () {
    radio.sendString("Feil")
    bitbot.setLedColor(0xFF0000)
    bitbot.motor(BBMotor.Both, 0)
    Restart()
}
radio.onReceivedValue(function (name, value) {
    if (name == "P") {
        Pitch = value * -20
    } else if (name == "A") {
        Arm = value
    } else if (name == "R") {
        Roll = value * -20
    }
    if (!(Sekvens) && Arm == 1) {
        Sekvens = true
        Kjøretid = input.runningTime()
    }
})
let DriveRight = 0
let DriveLeft = 0
let Kjøretid = 0
let Roll = 0
let Arm = 0
let Pitch = 0
let Sekvens = false
let LøstOppgave = false
bitbot.select_model(BBModel.XL)
radio.setGroup(1)
let Sekvenstid = 20000
Restart()
basic.forever(function () {
    if (Arm == 1) {
        DriveLeft = Pitch - pins.map(
        Roll,
        0,
        1023,
        Pitch,
        Pitch * -1
        )
        DriveRight = Pitch - pins.map(
        Roll,
        0,
        -1023,
        Pitch,
        Pitch * -1
        )
        bitbot.motor(BBMotor.Left, Pitch - DriveLeft)
        bitbot.motor(BBMotor.Right, Pitch - DriveRight)
        if (input.runningTime() - Kjøretid > Sekvenstid && !(LøstOppgave) && Sekvens) {
            radio.sendNumber(11)
            FeilLøsning()
        }
    } else {
        bitbot.motor(BBMotor.Both, 0)
    }
})
