#ifndef OB64_GAME_CLASS_SPRITE_H
#define OB64_GAME_CLASS_SPRITE_H

#include "common/types.h"

/* Returns the decoded resource base. The output selects a block of 80
 * halfwords inside that resource. A missing entry clears both results. */
void *func_00045ae0(u8 cls, u8 variant, u16 **out_pixels);

/* Preserve the established address spellings at their existing call sites. */
void *D_8016FBE0(u8 cls, u8 variant, u16 **out_pixels);
void *func_8016FBE0(u8 cls, u8 variant, u16 **out_pixels);

#endif
