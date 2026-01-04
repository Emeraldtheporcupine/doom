namespace SpriteKind {
    export const Darkness = SpriteKind.create()
    export const SHMUP = SpriteKind.create()
    export const mathSprite = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    music.stopAllSounds()
    music.play(music.createSoundEffect(WaveShape.Noise, 2559, 2620, 255, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    game.reset()
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (BulletsRemaining > 0) {
        BulletsRemaining += -1
        sprites.destroy(bullet)
        bulletSpeed = 0
        Gun.setImage(assets.image`ShotgunPow`)
        bullet = sprites.create(assets.image`bullet`, SpriteKind.Projectile)
        bullet.setScale(0.5, ScaleAnchor.Middle)
        bulletDirection = spriteutils.degreesToRadians(FacingDirection)
        timer.after(100, function () {
            Gun.setImage(assets.image`Shotgun`)
        })
        Render.move(Player, 15)
        timer.after(2000, function () {
            sprites.destroy(bullet)
        })
    } else {
        AbleToShoot = false
        BulletsRemaining = 0
    }
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (sprite.tileKindAt(TileDirection.Left, sprites.dungeon.purpleOuterNorth1) || sprite.tileKindAt(TileDirection.Right, sprites.dungeon.purpleOuterNorth1) || sprite.tileKindAt(TileDirection.Top, sprites.dungeon.purpleOuterNorth1) || sprite.tileKindAt(TileDirection.Bottom, sprites.dungeon.purpleOuterNorth1)) {
        if (sprite.tilemapLocation().column == 29 && sprite.tilemapLocation().row == 15) {
            tiles.setWallAt(tiles.getTileLocation(28, 15), false)
        } else if (sprite.tilemapLocation().column == 12 && sprite.tilemapLocation().row == 20) {
            tiles.setWallAt(tiles.getTileLocation(12, 19), false)
        } else {
        	
        }
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    AbleToShoot = false
    BulletsRemaining = 10
    animation.runImageAnimation(
    Gun,
    assets.animation`GunReload`,
    50,
    false
    )
    timer.after(1000, function () {
        Gun.setImage(assets.image`Shotgun`)
        AbleToShoot = true
    })
})
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    sprites.destroy(sprite)
})
function Spawn () {
    for (let gHostSprites of tiles.getTilesByType(assets.tile`myTile`)) {
        gHost = sprites.create(assets.image`Ghost`, SpriteKind.Enemy)
        tiles.placeOnTile(gHost, gHostSprites)
        tiles.setTileAt(gHostSprites, assets.tile`transparency16`)
        gHost.follow(Player, 30)
        animation.runImageAnimation(
        gHost,
        assets.animation`GhostAnim`,
        100,
        true
        )
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.startEffect(effects.disintegrate, 500)
    music.play(music.createSoundEffect(WaveShape.Noise, 3343, 3071, 255, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    sprites.destroy(sprite)
    sprites.destroy(otherSprite, effects.disintegrate, 250)
})
let enemyCount: Sprite[] = []
let gHost: Sprite = null
let bulletDirection = 0
let bulletSpeed = 0
let bullet: Sprite = null
let FacingDirection = 0
let Gun: Sprite = null
let Player: Sprite = null
let BulletsRemaining = 0
let AbleToShoot = false
AbleToShoot = true
BulletsRemaining = 10
scene.setBackgroundImage(assets.image`Backdrop`)
tiles.setCurrentTilemap(tilemap`level1`)
Render.setViewMode(ViewMode.raycastingView)
Render.setAttribute(Render.attribute.wallZScale, 1)
Player = Render.getRenderSpriteVariable()
tiles.placeOnTile(Player, tiles.getTileLocation(1, 1))
Render.moveWithController(2, 3, 1)
Gun = sprites.create(assets.image`Shotgun`, SpriteKind.SHMUP)
Gun.setScale(0.2, ScaleAnchor.Middle)
let _Math = sprites.create(assets.image`math`, SpriteKind.mathSprite)
let TurnRate = 3.65
FacingDirection = 0
music.play(music.createSong(assets.song`At Dooms Gate Intro`), music.PlaybackMode.LoopingInBackground)
Spawn()
game.onUpdate(function () {
    if (controller.right.isPressed()) {
        FacingDirection += TurnRate
    } else if (controller.left.isPressed()) {
        FacingDirection += 0 - TurnRate
    }
    spriteutils.placeAngleFrom(
    Gun,
    spriteutils.degreesToRadians(FacingDirection),
    10,
    Player
    )
    Gun.setFlag(SpriteFlag.Ghost, true)
    if (bullet) {
        bulletSpeed += 4
        spriteutils.placeAngleFrom(
        bullet,
        bulletDirection,
        bulletSpeed,
        Gun
        )
    } else {
        bulletSpeed = 0
    }
    enemyCount = sprites.allOfKind(SpriteKind.Enemy)
    info.setScore(enemyCount)
})
