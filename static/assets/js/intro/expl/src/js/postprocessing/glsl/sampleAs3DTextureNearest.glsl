// http://jsfiddle.net/greggman/gSnHZ/

// vec2 computeSliceOffset(float slice, float slicesPerRow, vec2 sliceSize) {
//  return sliceSize * vec2(mod(slice, slicesPerRow), floor(slice / slicesPerRow));
// }

vec2 computeSliceOffset(float slice, vec4 sliceInfo) {
    return sliceInfo.zw * vec2(mod(slice, sliceInfo.y), floor(slice * sliceInfo.z));
}

// sliceInfo.x = size aka volumeSliceColumn * volumeSliceRow
// sliceInfo.y = slicesPerRow
// sliceInfo.z = 1.0 / slicesPerRow
// sliceInfo.w = 1.0 / floor((sliceInfo.x + sliceInfo.y - 1.0) * sliceInfo.z);

// for a 128^3 => 128 * 128 * (16 * 8) = 2048* 1024
// sliceInfo.x = 16.0 * 8.0,
// sliceInfo.y = 16.0,
// sliceInfo.z = 1.0 / 16.0,
// sliceInfo.w = 1.0 / floor((16.0 * 8.0 + 16.0 - 1.0) / 16.0)

vec4 sampleAs3DTextureNearest(sampler2D tex, vec3 texCoord, vec4 sliceInfo) {
    // vec4 sampleAs3DTextureNearest(sampler2D tex, vec3 texCoord, float size, float slicesPerRow, vec2 sliceSize) {
    // float numRows = floor((size + slicesPerRow - 1.0) / slicesPerRow);
    float slice = texCoord.z * sliceInfo.x;
    float sliceZ = floor(slice);

    // vec2 sliceSize = vec2(1.0 / slicesPerRow, 1.0 / numRows);

    vec2 sliceOffset = computeSliceOffset(sliceZ, sliceInfo);

    vec2 slicePixelSize = sliceInfo.zw / sliceInfo.x;

    vec2 uv = slicePixelSize * 0.5 + texCoord.xy * (sliceInfo.zw - slicePixelSize);

    return texture2D(tex, sliceOffset + uv);
}

#pragma glslify: export(sampleAs3DTextureNearest)
