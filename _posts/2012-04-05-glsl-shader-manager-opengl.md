---
layout: post
title: GLSL Shader Manager OpenGL
categories:
- C++
- OpenGL
tags:
- glsl
- opengl
- shader
status: publish
type: post
published: true
---

Nowadays most of OpenGL applications use shaders (programmable pipeline) for rendering effects on graphics hardware instead of old provided functions in OpenGL 1.0 (fixed-function pipeline). There are many advantages of using shaders, such as performing arbitrary transformations on vertices and pixels, easily maintaining effect algorithms, etc. In this post I will share with you how I load, link and manage GLSL shaders in my projects.

**Shader class**

{% highlight cpp %}
#pragma once

#ifndef SHADER_H
#define SHADER_H

#include <string>
#include <map>

class CShader
{
////////////////////////////////////////////////////////////
//  Types
protected:
  typedef std::map<std::string, int> TVariableMap;

////////////////////////////////////////////////////////////
//  Fields
protected:
  /// map stores shader's variables
  TVariableMap m_VariableMap;
  /// Shader properties
  unsigned int m_VertexShader;
  unsigned int m_GeometricShader;
  unsigned int m_FragmentShader;
  unsigned int m_Program;
////////////////////////////////////////////////////////////
//  Methods
public:
  /// Constructor
  CShader();
  /// Destructor
  ~CShader();

  /// Getter/setters shader properties
  inline unsigned int GetVert() { return m_VertexShader; }
  inline unsigned int GetGeom() { return m_GeometricShader; }
  inline unsigned int GetFrag() { return m_FragmentShader; }
  inline unsigned int GetProgram() { return m_Program; }
  inline void SetVertShader(unsigned int inValue) { m_VertexShader = inValue; }
  inline void SetGeomShader(unsigned int inValue) { m_GeometricShader = inValue; }
  inline void SetFragShader(unsigned int inValue) { m_FragmentShader = inValue; }
  inline void SetProgram(unsigned int inValue) { m_Program = inValue; }

  ///Get index of an atribute variable of this shader
  int GetAttributeIndex(const char* inVarName);

  /// Get index of an uniform variable of this shader
  int GetUniformIndex(const char* inVarName);

protected:
  /**
   * Get index of an variable of the shader
   * @param inVarName the variable name
   * @param inIsUniform whether the variable is an uniform
   */
  int GetVariableIndex(const char* inVarName, bool inIsUniform);
}; // end class CShader

#endif
{% endhighlight %}

The member field `m_VariableMap` is for storing indices of attribute and uniform variables in a shader program. Later in the rendering loop, the program can look up these indices via `GetAttributeIndex` and `GetUniformIndex` functions. Below is the implementation for these functions:

{% highlight cpp %}
int CShader::GetUniformIndex(const char* inVarName)
{
  return GetVariableIndex(inVarName, true);;
}

int CShader::GetAttributeIndex(const char* inVarName)
{
  return GetVariableIndex(inVarName, false);
}

int CShader::GetVariableIndex(const char *inVarName, bool inIsUniform)
{
  int theResult = -1;
  if (m_Program != 0)
  {
    TVariableMap::iterator iter;
    iter = m_VariableMap.find(inVarName);
    if (iter == m_VariableMap.end())
    {
      if (inIsUniform) // uniform variables
        theResult = glGetUniformLocation(m_Program, inVarName);
      else // attribute variables
        theResult = glGetAttribLocation(m_Program, inVarName);
      if(theResult != -1)
        m_VariableMap[inVarName] = theResult;
    }
    else
      theResult = iter->second;
  }
  return theResult;
}
{% endhighlight %}

**Shader Manager class**

The Shader Manager class loads source code of shaders, compiles them, creates shader programs and links them to OpenGL context. It also stores Shader class object pointer to the map variable `m_ShaderMap` so that the application can retrieve the shaders later without loading/linking again. Here is the header of the class:

{% highlight cpp %}
#pragma once

#ifndef SHADER_MANAGER_H
#define SHADER_MANAGER_H

#include <string>
#include <map>

// Forward declaration
class CShader;

class CShaderManager
{
////////////////////////////////////////////////////////////
//  Types
protected:
  typedef std::map<std::string, CShader*> TShaderMap;

////////////////////////////////////////////////////////////
//  Fields
protected:
  /// Map of shader name and shader obj pointer
  TShaderMap m_ShaderMap;

  /// Default shader string
  static const char* DEFAULT_SHADER;

  /// The unique instance of this class
  static CShaderManager*  s_Instance;

////////////////////////////////////////////////////////////
//  Methods
public:
  /// Destructor
  ~CShaderManager();

  // Get the unique instance of this class
  static CShaderManager*  GetInstance();

  /**
   * Get shader object pointer
   * @return if successful load/link, the loaded/linked shader object point is return, otherwise return the default shader
   */
  CShader* GetShader(const char* inVertFileName, const char* inFragFileName, const char* inGeomFileName);

protected:
  /// Default constructor (protected)
  CShaderManager();

  /**
   * Load, compile and create a vertex/fragment/geometric shader program and link the program
   * @return CShader object pointer if all shaders are loaded successfully, NULL otherwise
   */
  CShader* Load(const char* inVertexFilename
        , const char* inFragmentFilename
        , const char* inGeometryFilename);

  /** Releases all resources */
  void Dispose(CShader* inShader);

  /**
   * Load and compile a shader
   * @param inShaderType type of shader: GL_VERTEX_SHADER, GL_GEOMETRY_SHADER_EXT or GL_FRAGMENT_SHADER
   * @param inFileName shader file name
   * @param inOutShader the pointer to shader
   * @return true if successfully loaded, false otherwise
   */
  bool LoadShader(unsigned int inShaderType,  const std::string &inFileName, unsigned int &inOutShader);

  /**
   * Load a shader source code from a file.
   * @return the pointer to the source
   */
  char** LoadSource(int&amp; outLineCount, const std::string&amp; inFileName);
}; // end class ShaderManager
#endif
{% endhighlight %}

The `GetShader` function will look up the map `m_ShaderMap` for requested shader before loading it. If the shader cannot be found or there is error while compiling it, the default shader object which has index program of 0 will be returned.

{% highlight cpp %}
CShader* CShaderManager::GetShader(const char* inVertFileName, const char* inFragFileName, const char* inGeomFileName)
{
  std::string theString = inVertFileName;
  if(inFragFileName)
    theString += inFragFileName;
  if(inGeomFileName)
    theString += inGeomFileName;

  TShaderMap::iterator i = m_ShaderMap.find(theString);
  if(i != m_ShaderMap.end())
  {
    return (i->second);
  }
  else
  {
    CShader* theResult = Load(inVertFileName, inFragFileName, inGeomFileName);
    if(theResult != NULL)
    {
      // successful loaded and linked shader program, added to map and return the result
      m_ShaderMap[theString] = theResult;
      return theResult;
    }
  }

  // if load/link unsuccessfully, return default shader which program = 0
  return m_ShaderMap[DEFAULT_SHADER];
}
{% endhighlight %}

Note that I use the shaders' file names as the keys for the shader objects in m_ShaderMap variable. The implementations of other functions are easily to understand as I have commented in the header. Here is the code for loading, compiling and creating a shader:

{% highlight cpp %}
bool CShaderManager::LoadShader(unsigned int inShaderType, const std::string& inFileName, GLuint &inOutShader)
{
  if (inFileName.empty()) {
    printf("Shader's filename is empty!n");
    return false;
  }

  // load shader source from file
  int sourceSize = 0;
  char** pShaderSource = LoadSource(sourceSize, inFileName);
  if (pShaderSource == NULL){
    printf("Cannot load file source %s.n", inFileName.c_str());
    return false;
  }

  // create shader pointer
  inOutShader = glCreateShader(inShaderType);
  if (inOutShader == 0) {
    printf("Cannot create shader, type: %un", inShaderType);
    return false;
  }

  // compile shader
  glShaderSource(inOutShader, sourceSize, (const GLchar**)pShaderSource, NULL);
  glCompileShader(inOutShader);

  // free up the source
  for (int i=0; i &lt; sourceSize; ++i) {
    if (pShaderSource[i] != NULL)
      free(pShaderSource[i]);
  }
  free(pShaderSource);

  // check compilation success
  GLint status = GL_FALSE;
  glGetShaderiv(inOutShader, GL_COMPILE_STATUS, &amp;status);
  if (status != GL_TRUE) {
    // fail to compile, check the log
    int logLength = 1;
    glGetShaderiv(inOutShader, GL_INFO_LOG_LENGTH, &amp;logLength);

    char* infoLog = (char*)malloc(logLength + 1);
    glGetShaderInfoLog(inOutShader, logLength, &amp;logLength, infoLog);
    printf("Failed to compile shader %sn%s", inFileName.c_str(), infoLog);
    free(infoLog);

    return false;
  }

  return true;
} // end LoadShader
{% endhighlight %}

That's it. It is a simple way to manage GLSL shaders in an application I think. If you have another implementation for this, feel free to comment below so that we can discuss. The source codes for these classes can be found at [my GitHub][GLSLShaderManager-github]{:target="_blank"}. I have also included a simple OpenGL program in main.cpp for testing so you can have a look to see how to use these classes. Hope you enjoy the post! :-)

[GLSLShaderManager-github]: https://github.com/luugiathuy/GLSLShaderManager
