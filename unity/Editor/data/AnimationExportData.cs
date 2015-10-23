using System;
using System.Collections;
using System.Collections.Generic;

using UnityEngine;
using UnityEditor;
// http://answers.unity3d.com/questions/438407/the-algorithm-of-curve-in-shuriken-particle-system.html

public class AnimationExportData
{
	private Transform t;
	private RuntimeAnimatorController a;
	private AnimationClip defaultAnimation;
	private Hashtable properties;

	public AnimationExportData (Transform transform, bool useQuaternion)
	{
		t = transform;

		Animator ator = t.GetComponent<Animator>();

		a = ator.runtimeAnimatorController;

		defaultAnimation = a.animationClips[0];

		AnimationClipCurveData[] data = AnimationUtility.GetAllCurves (defaultAnimation, true);
		properties = new Hashtable();

		foreach (AnimationClipCurveData d in data) {
			
			string jn = AnimationUtil.ExtractPropertyName (d.propertyName);

			if(!properties.ContainsKey (d.path))
				properties.Add(d.path, new AnimationObject(d.path));

			AnimationObject ao = (AnimationObject) properties[d.path];

			AnimationProperty p = new AnimationProperty (jn, d);
			ao.Properties.Add(p);
		}
	}

	public string Name {
		get { return NamesUtil.CleanLc (t.name); }
	}

	public string UID {
		get { return "a" + defaultAnimation.GetInstanceID(); }
	}

	public float FrameRate {
		get { return defaultAnimation.frameRate; }
	}
	
	public string AnimationName {
		get { return NamesUtil.CleanLc (defaultAnimation.name); }
	}
	
	public string Length {
		get { return defaultAnimation.length.ToString (ExporterProps.LN); }
	}
		
	public string Wrapmode {
		get { return defaultAnimation.wrapMode.ToString().ToLower(); }
	}
		
	public ICollection Transforms {
		get { return properties.Values; }
	}
}

public struct AnimationObject
{
	public string Name;
	public List<AnimationProperty> Properties;

	public AnimationObject(string n) 
	{
		Name = NamesUtil.CleanLc (n);
		Properties = new List<AnimationProperty>();
	}
}

public struct AnimationProperty
{
	public string Property;
	private AnimationCurve Curve;

	public AnimationProperty (string n, AnimationClipCurveData d)
	{
		Property = n;
		Curve = d.curve;
	}

	public string PostWrapMode 
	{
		get { return Curve.postWrapMode.ToString ().ToLower (); }
	}

	public string PreWrapMode 
	{
		get { return Curve.preWrapMode.ToString ().ToLower (); }
	}

	public int Length 
	{
		get { return Curve.length; }
	}

	public bool HasChangeInValue {
		get {

			float max = -1000000000f;
			float min =  1000000000f;

			for(int i = 0; i < Curve.keys.Length; i++) {
				max = Math.Max(max, Curve.keys[i].value);
				min = Math.Min(min, Curve.keys[i].value);
			}

			Debug.Log(Property + " max/min " + max + " / " + min);

			return max != min;
		}
	}

	public Keyframe[] Keys 
	{
		get { return Curve.keys; }
	}
}

















