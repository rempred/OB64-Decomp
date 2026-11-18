typedef unsigned char u8;
typedef unsigned short u16;
typedef signed short s16;
typedef signed int s32;

extern u8 D_8018FAE0;
extern u8 D_8018FBDC;

#define SCENE_MODE (*(u8 *)0x801939D1)

s16 func_00046738(s32 operand)
{
    u16 request = 0xFFFE;

    switch ((u8)operand) {
    case 1:
        request = 0x8002;
        break;
    case 2:
        request = 0x8003;
        break;
    case 3:
        request = 0x8005;
        break;
    case 4:
        SCENE_MODE = 1;
        request = 0x8007;
        break;
    case 11:
        request = 2;
        break;
    case 12:
        request = 3;
        break;
    case 13:
        request = 5;
        break;
    case 14:
        SCENE_MODE = 1;
        request = 7;
        break;
    case 18:
        request = 0x13;
        break;
    case 19:
        request = 0x11;
        break;
    case 20:
        SCENE_MODE = 2;
        request = 0x8007;
        break;
    case 21:
        SCENE_MODE = 0;
        request = 0x8007;
        break;
    case 22:
        D_8018FAE0 = 1;
        request = 0x8016;
        break;
    case 23:
        D_8018FAE0 = 0;
        D_8018FBDC = 0;
        request = 0x8016;
        break;
    case 24:
        request = 0x8016;
        D_8018FAE0 = 0;
        D_8018FBDC = 1;
        break;
    case 25:
        request = 0x8016;
        D_8018FAE0 = 0;
        D_8018FBDC = 2;
        break;
    case 26:
        request = 0xFFFD;
        break;
    case 27:
        D_8018FAE0 = 3;
        request = 0x8016;
        break;
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 15:
    case 16:
    case 17:
        request = 0xFFFE;
        break;
    }
    return request;
}
