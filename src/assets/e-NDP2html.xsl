<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform   version="1.1"   xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:rng="http://relaxng.org/ns/structure/1.0"
  xmlns:eg="http://www.tei-c.org/ns/Examples"
  xmlns:tei="http://www.tei-c.org/ns/1.0" 
  xmlns:html="http://www.w3.org/1999/xhtml"
  xmlns:epub="http://www.idpf.org/2007/ops"
  exclude-result-prefixes="eg html rng tei epub"
  xmlns:exslt="http://exslt.org/common"
  extension-element-prefixes="exslt"
  >
  <!-- xml view source -->
  <!--<xsl:import href="http://localhost:8000/teipub/xsl/tei2html.xsl"/>-->
  <!-- on garde les CSS par défaut -->
  <!--<xsl:param name="theme">/teipub/theme/</xsl:param>-->
  <!-- on déclare une CSS custom (appel in tei2html.xsl) -->
  <!--<xsl:param name="customCSS">/schema/e-NDP_theme/e-NDP.css</xsl:param>-->
  <!-- on déclare un JS custom -->
    <!--<xsl:param name="customJS">/schema/e-NDP_theme/e-NDP.js</xsl:param>-->
  <!-- gestion du facsimile -->
  <xsl:template match="tei:facsimile"/>
  
  
  <!-- rubriquage ? -->
  <xsl:template match="tei:rubric">
    <aside>
      <xsl:call-template name="atts"/>
      <xsl:apply-templates/>
    </aside>
  </xsl:template>
  
  <!-- gestion des lb HTR -->
  <xsl:template match="tei:lb[@type='htr']">
    <xsl:variable name="iiif-base">
      <text>https://iiif.chartes.psl.eu/images/endp/FRAN_0393_LL_117/</text>
    </xsl:variable>
    <xsl:variable name="zone-id">
      <xsl:value-of select="substring(@facs, 2)"/>
    </xsl:variable>
    <xsl:variable name="img-id">
      <xsl:value-of select="//tei:zone[@xml:id = $zone-id]/preceding-sibling::tei:graphic/@url"/>
    </xsl:variable>
    <xsl:variable name="x">
      <xsl:value-of select="//tei:zone[@xml:id = $zone-id]/@ulx"/>
    </xsl:variable>
    <xsl:variable name="y">
      <xsl:value-of select="//tei:zone[@xml:id = $zone-id]/@uly"/>
    </xsl:variable>
    <xsl:variable name="w">
      <!-- erreur d’interprétation dans alto2tei, revoir, la ligne ci-dessous et la bonne…-->
      <!--<xsl:value-of select="//tei:zone[@xml:id = $zone-id]/@lrx - $x"/>-->
      <xsl:value-of select="//tei:zone[@xml:id = $zone-id]/@lrx"/>
    </xsl:variable>    
    <xsl:variable name="h">
      <!-- erreur d’interprétation dans alto2tei, revoir, la ligne ci-dessous et la bonne…-->
      <!--<xsl:value-of select="@//tei:zone[@xml:id = $zone-id]/@lry - $y"/>-->
      <xsl:value-of select="//tei:zone[@xml:id = $zone-id]/@lry"/>
    </xsl:variable>    
    <xsl:variable name="iiif-region">
      <xsl:value-of select="concat($x,',',$y,',',$w,',',$h)"/>
    </xsl:variable>
    <a>
      <xsl:call-template name="atts"/>
      <xsl:if test="@facs">
        <xsl:attribute name="href">
          <xsl:if test="not(starts-with(@facs, 'http')) and /*/@xml:base">
            <xsl:value-of select="/*/@xml:base"/>
          </xsl:if>
          <!--<xsl:value-of select="@facs"/>-->
          <xsl:value-of select="concat($iiif-base,$img-id,'/',$iiif-region,'/full/0/default.jpg')"/>
        </xsl:attribute>
      </xsl:if>
    </a>
  </xsl:template>
  
  <xsl:template match="tei:pb" name="pb">
    <xsl:variable name="norm" select="normalize-space(@n)"/>
    <xsl:variable name="text">
      <xsl:if test="./@ana='iiif'">
        <xsl:value-of select="normalize-space(following-sibling::tei:pb[@ana='handwritten'])"/>
      </xsl:if>
      <!--
      <xsl:choose>
        <xsl:when test="starts-with(@ed, 'frantext')"/>
        <xsl:when test="$norm = ''"/>
        <xsl:when test="contains('[({', substring($norm, 1,1))">
          <xsl:value-of select="$norm"/>
        </xsl:when>
        <xsl:when test="@ana">[<xsl:value-of select="@ana"/>]</xsl:when>
        <xsl:when test="@ed">[<xsl:value-of select="@n"/>]</xsl:when>
        <xsl:when test="@n != ''  and contains('0123456789IVXDCM', substring(@n,1,1))">{p. <xsl:value-of select="@n"/>}</xsl:when>
        <xsl:otherwise>[<xsl:value-of select="@n"/>]</xsl:otherwise>
      </xsl:choose>
      -->
    </xsl:variable>
    <xsl:variable name="class">
      <xsl:text>pb</xsl:text>
      <xsl:if test="@ed">
        <xsl:text> ed </xsl:text>
        <xsl:value-of select="@ed"/>
      </xsl:if>
      <xsl:if test="@facs">
        <xsl:text> facs</xsl:text>
      </xsl:if>
    </xsl:variable>
    <xsl:variable name="id">
      <xsl:call-template name="id"/>
    </xsl:variable>
    <!-- test if inside mixed content, before adding a space, to keep automatic indent  -->
    <xsl:variable name="mixed" select="../text()[normalize-space(.) != '']"/>
    <xsl:choose>
      <xsl:when test="$text =''"/>
      <xsl:when test="$format = $epub2">
        <xsl:if test="$mixed != ''">
          <xsl:text> </xsl:text>
        </xsl:if>
        <sub>
          <xsl:if test="$id != ''">
            <xsl:attribute name="id">
              <xsl:value-of select="$id"/>
            </xsl:attribute>
          </xsl:if>
        </sub>
        <xsl:if test="$mixed != ''">
          <xsl:text> </xsl:text>
        </xsl:if>
      </xsl:when>
      <xsl:otherwise>
        <xsl:if test="$mixed != ''">
          <xsl:text> </xsl:text>
        </xsl:if>
        <a class="{normalize-space($class)}" href="{@facs}">
          
          <xsl:choose>
            <!-- @xml:base ? -->
            <xsl:when test="@facs">
              <img>
              <xsl:attribute name="src">
                <xsl:if test="not(starts-with(@facs, 'http')) and /*/@xml:base">
                  <xsl:value-of select="/*/@xml:base"/>
                </xsl:if>
                <xsl:value-of select="concat(substring-before(@facs, '/full/full/0/default.jpg'), '/full/50,/0/default.jpg')"/>
              </xsl:attribute>
              </img>
            </xsl:when>
            <xsl:when test="$id != ''">
              <xsl:attribute name="href">
                <xsl:text>#</xsl:text>
                <xsl:value-of select="$id"/>
              </xsl:attribute>
            </xsl:when>
          </xsl:choose>
          <!--
          <xsl:if test="$id != ''">
            <xsl:attribute name="id">
              <xsl:value-of select="$id"/>
            </xsl:attribute>
          </xsl:if>
          -->
          <!-- TODO by js
          <xsl:if test="not(@ed)">
            <xsl:attribute name="onclick">if(window.pb) pb(this, '<xsl:value-of select="$docid"/>', '<xsl:value-of select="@n"/>');</xsl:attribute>
          </xsl:if>
          -->
          <xsl:value-of select="$text"/>
          <!-- définir ce qu’on imprime pour la pagination… -->
        </a>

        <xsl:if test="@ed">
          <xsl:text> </xsl:text>
        </xsl:if>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  
  
  
</xsl:transform>
