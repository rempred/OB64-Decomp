#include "common/mus_channel.h"

typedef struct {
    u16 wave;
    u16 envelope;
    u8 pan;
    u8 note;
} MusDrum;
typedef struct {
    u8 pad00[4];
    s32 count;
    s32 unk08;
    u32 *channels;
    u32 *volumes;
    u32 *pitchbends;
    u8 *envelopes;
    MusDrum *drums;
    u16 *wavetable;
    u32 master;
    s32 relocated;
} MusSong;
extern s32 D_800B1804;
extern MusChannel *D_800B180C;
s32 func_000140cc(MusSong *song);
void func_000122c8(s32 handle);
void func_00013664(MusChannel *cp);
extern u8 *(*D_800A98B0[])(MusChannel *cp, u8 *ptr);
s32 func_00011920(MusSong *song, s32 marker) {
    s32 handle = func_000140cc(song);
    s32 i;
    MusChannel *cp = D_800B180C;
    u8 *ptr;
    u8 cmd, v, d;
    u8 *q;
    s32 n;
    for (i = 0; i < D_800B1804; i++, cp++) {
        if (cp->handle != handle || cp->unk74 != song || cp->unk04 == 0) {
            continue;
        }
    next:
            ptr = (u8 *)cp->unk04;
            cmd = *ptr;
            if (cmd >= 0x80) {
                if (cmd == 0xAB && ptr[1] == marker) {
                    goto found;
                }
                cp->unk04 = (s32)D_800A98B0[cmd & 0x7F](cp, ptr + 1);
            } else {
                cp->unk04 = (s32)(ptr + 1);
                if (cp->velon) {
                    cp->unk04 = (s32)(ptr + 2);
                    v = ptr[1];
                    cp->unkBB = v;
                    if (v >= 0x80) {
                        cp->unkBB = v & 0x7F;
                        cp->velon = 0;
                        cp->unkD3 = cp->unkBB;
                    }
                } else {
                    cp->unkBB = cp->unkD3;
                }
                if (cp->length != 0 && cp->unkB7 == 0) {
                    cp->unk9A = cp->length;
                } else {
                    cp->unkB7 = 0;
                    q = (u8 *)cp->unk04;
                    cp->unk04 = (s32)(q + 1);
                    d = q[0];
                    if (d < 0x80) {
                        cp->unk9A = d;
                    } else {
                        cp->unk04 = (s32)(q + 2);
                        cp->unk9A = q[1] + ((d & 0x7F) << 8);
                    }
                }
                cp->unk0C += cp->unk9A << 8;
            }
        if (cp->unk04 != 0) {
            goto next;
        }
    found:
        cp->unk3C = cp->unk0C;
        if (cp->unk04 != 0) {
            ptr = (u8 *)cp->unk04 + 2;
            n = *ptr++;
            if (n >= 0x80) {
                n &= 0x7F;
                n <<= 8;
                n |= *ptr++;
            }
            cp->unkAA = 0;
            cp->unk9A = n;
            cp->unk04 = (s32)ptr;
            cp->unk0C -= n << 8;
        }
        cp->unk40 = cp->unk0C;
        if (cp->pvolume != ((void *)0)) {
            func_000135a0(cp);
        }
        if (cp->ppitchbend != ((void *)0)) {
            func_00013664(cp);
        }
    }
    func_000122c8(handle);
    return handle;
}
void func_000122c8(s32 handle);
void func_00013664(MusChannel *cp);
