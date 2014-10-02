---
layout: post
title: Create Frame Buffer Object OpenGL
categories:
- OpenGL
tags:
- fbo
- frame buffer object
- opengl
status: publish
type: post
published: true
---

In OpenGL, frame buffer is the final destination in the rendering pipeline. When we create a window for our OpenGL application, it automatically create frame buffer object for us. However we need to create our own frame buffer object in some cases, such as offscreen rendering. OpenGL applications in iOS also need to create frame buffer object. In this post, I will share with you how we can create a frame buffer object (FBO).

Here is the code to create a FBO with 1 color attachment and depth buffer. This is the most common FBO we will use:

{% highlight cpp %}
GLuint fbo = 0;
GLuint colorTexture = 0; // color texture for color attachment
GLuint depthRBO = 0; // render buffer object for depth buffer

// set up color texture
// generate a texture id
glGenTextures(1, &colorTexture);
// bind the texture
glBindTexture(GL_TEXTURE_2D, colorTexture);
// set texture parameters
glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
// create the texture in the GPU
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA , inScreenWidth, inScreenHeight, // need screen dimension
	0, GL_BGRA, GL_UNSIGNED_BYTE, NULL);
// unbind the texture
glBindTexture(GL_TEXTURE_2D, 0);

// create a render buffer object for the depth buffer
glGenRenderbuffers(1, &depthRBO);
// bind the texture
glBindRenderbuffer(GL_RENDERBUFFER, depthRBO);
// create the render buffer in the GPU
glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT, inScreenWidth, inScreenHeight);
// unbind the render buffer
glBindRenderbuffer(GL_RENDERBUFFER, 0);

// create a frame buffer object
glGenFramebuffers(1, &outFrameBufferObj);
glBindFramebuffer(GL_FRAMEBUFFER, outFrameBufferObj);
// attach the color texture to the frame buffer
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, colorTexture, 0);
// attach depth buffer
glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, depthRBO);

// check the frame buffer
GLuint status = glCheckFramebufferStatus(GL_FRAMEBUFFER);
if ( status != GL_FRAMEBUFFER_COMPLETE)
{
	printf("Frame buffer cannot be generated! Status: %in", status);
}

glBindFramebuffer(GL_FRAMEBUFFER,0);
{% endhighlight %}

In the example above, we use texture for color attachment and render buffer object (RBO) for depth attachment of the FBO. In OpenGL, both types are supported for the FBO. However it prefers render buffer object to texture due to performance. Textures are used if we want the Render-To-Texture feature in our application. As for depth buffer, in some cases after rendering we need to use depth buffer for post processing, then we need to create a texture and attached it to FBO so that we can use use the texture for processing. Here is the code how we create depth buffer for FBO using texture:

{% highlight cpp %}
GLuint depthTexture;
glGenTextures(1, &depthTexture);
// bind the texture
glBindTexture(GL_TEXTURE_2D, depthTexture);
// set texture parameters
glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
// create the texture in the GPU
glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT , inScreenWidth, inScreenHeight,
	0, GL_DEPTH_COMPONENT, GL_UNSIGNED_INT, NULL);
// unbind the texture
glBindTexture(GL_TEXTURE_2D, 0);

....

// attach to frame buffer
glBindFramebuffer(GL_FRAMEBUFFER, outFrameBufferObj);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, depthTexture, 0);
{% endhighlight %}


That's for depth buffer of FBO. Now if our FBO need to have stencil buffer to support stencil testing, we have to create and attach it to the FBO. OpenGL support `GL_DEPTH24_STENCIL8` format type for texture and render buffer object (24 bit for depth buffer, 8 bit for stencil) and this is most people did to support depth and stencil buffers. For render buffer object, we just need to change the `glRenderbufferStorage` and `glFramebufferRenderbuffer` functions to:

{% highlight cpp %}
glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8, inScreenWidth, inScreenHeight);
...
glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_STENCIL_ATTACHMENT, GL_RENDERBUFFER, depthRBO);
{% endhighlight %}

For texture, we need to change `glTexImage2D` and `glFramebufferTexture2D` functions:

{% highlight cpp %}
glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH24_STENCIL8 , inScreenWidth, inScreenHeight,
	0, GL_DEPTH_STENCIL, GL_UNSIGNED_INT_24_8, NULL);
...
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_STENCIL_ATTACHMENT, GL_TEXTURE_2D, depthStencilTexture, 0);
{% endhighlight %}

That's about creating FBO to support render-to-texture features, depth and stencil testing. Hope it helps! =)
