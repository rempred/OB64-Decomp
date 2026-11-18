typedef unsigned char u8;
typedef signed int s32;

typedef struct QueryActor {
    u8 pad000[0x147];
    u8 inputIndex;
} QueryActor;

typedef struct QueryScene {
    u8 pad00[0x18];
    QueryActor *actors[28];
} QueryScene;

typedef struct ActorInput {
    u8 pad00[0x34];
    u8 alignment;
    u8 pad35[0x13];
    s32 artKey;
    u8 pad4C[0xAA];
    u8 memberIndex;
    u8 padF7;
} ActorInput;

typedef struct QueryResident {
    u8 pad000[0x1C4];
    ActorInput inputs[20];
} QueryResident;

extern QueryScene *D_8022A974;
extern QueryResident *D_801CE8BC;
extern u8 D_80193BD4[];
extern u8 D_80195574[];
typedef struct StoryOverride {
    u8 profile;
    u8 artKey;
} StoryOverride;

extern StoryOverride table_002868F0[];
extern s32 func_0020BFF8(void *input);

s32 func_002AC700(s32 slot)
{
    QueryActor *actor = D_8022A974->actors[slot];
    ActorInput *input;
    s32 profile;
    s32 gender;
    s32 offset;
    u8 *key;
    s32 artKey;

    if (actor == 0) {
        return -1;
    }

    input = &D_801CE8BC->inputs[actor->inputIndex];
    if (input->artKey == 0) {
        return -1;
    }

    profile = input->alignment;
    if (func_0020BFF8(input) == 0) {
        gender = D_80193BD4[input->memberIndex * 56];
    } else {
        gender = D_80195574[input->memberIndex * 52];
    }

    if (profile > 98) {
        profile = 98;
    }
    profile = gender * 3 + profile / 33;
    if (table_002868F0[0].artKey != 0xFF) {
        artKey = input->artKey;
        offset = 0;
        do {
            if (table_002868F0[offset].artKey == artKey) {
                profile = table_002868F0[offset].profile;
            }
            offset++;
        } while (table_002868F0[offset].artKey != 0xFF);
    }

    return profile;
}
